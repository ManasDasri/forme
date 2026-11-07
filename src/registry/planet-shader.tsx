"use client";
import { ShaderCanvas } from "./shader-canvas";

// A ringed gas giant rising over a sea, drawn as ASCII inside the shader: each cell samples
// the scene once and draws a glyph whose density is its light. The pointer moves the
// sunlight and, over the water, sends out ripples.
const fragment = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_resolution; uniform vec2 u_mouse; uniform float u_time; uniform vec3 u_color; uniform float u_ratio;
// Cell size in CSS pixels; the canvas renders at device resolution so small glyphs stay crisp.
const vec2 CELL_CSS = vec2(4.5, 7.5);
// Whole device pixels, so every glyph lands on the pixel grid. Below 1.5x there are too
// few pixels to draw a glyph that small, so standard screens use a slightly larger cell.
#define CELL (u_ratio>1.5?floor(CELL_CSS*u_ratio+.5):vec2(6.,10.))
const float HORIZON = -0.24;
float hash(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p*=2.03;a*=.5;}return v;}
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}

vec3 violet=vec3(.33,.27,.62), pale=vec3(.84,.86,1.0), amber=vec3(1.0,.84,.56);
const vec2 PLANET=vec2(0.0,HORIZON+.31);
const float R=.2;
const float TILT=-.3;
// The ring plane seen from slightly above: depth d in the plane shows on screen as d*RING_SIN.
// RING_D points across the plane toward its far side; RING_N is the plane's normal.
const float RING_SIN=.22;
const vec3 RING_D=vec3(0.,.22,-.9755);
const vec3 RING_N=vec3(0.,.9755,.22);

vec3 lightDir(){return normalize(vec3((u_mouse.x-.5)*2.6,.5,.75));}

// Brightness across the ring, from its inner edge (0) to its outer edge (1): a faint inner
// ring, the bright main ring, the dark Cassini division, then the outer ring with a thin gap.
float ringProfile(float r){
 float c=smoothstep(.0,.05,r)*smoothstep(.2,.16,r)*.35;
 float b=smoothstep(.16,.2,r)*smoothstep(.6,.58,r)*(.85+.15*sin(r*60.));
 float a=smoothstep(.65,.67,r)*smoothstep(1.,.97,r)*.62*(1.-.8*smoothstep(.85,.86,r)*smoothstep(.88,.87,r));
 return c+b+a;
}

// Everything above the waterline: stars, horizon glow, the planet, and its ring.
vec3 sky(vec2 p, vec2 cell){
 float t=u_time;
 vec3 L=lightDir(), ice=u_color, col=vec3(0.0);
 vec2 c=PLANET;
 float s=hash(cell);
 col+=step(.986,s)*(.3+.3*sin(t*1.6+s*60.))*vec3(.85,.88,1.);
 col+=ice*.2*exp(-max(p.y-HORIZON,0.)*9.)*(.6+.4*exp(-abs(p.x-c.x)*1.4));
 // Planet frame: x along the ring, y along the spin axis.
 vec2 q=rot(TILT)*(p-c)/R;
 vec3 Lp=vec3(rot(TILT)*L.xy,L.z); // the light in the planet's frame
 float r2=dot(q,q);
 // The ring plane, seen from slightly above: inner edge 1.25R, outer edge 2.3R.
 float e=length(vec2(q.x,q.y/RING_SIN));
 float ringR=(e-1.25)/(2.3-1.25);
 float ring=ringR>0.&&ringR<1.?ringProfile(ringR):0.;
 bool behind=q.y>0.0 && r2<1.0;
 if(r2<1.0){
  float z=sqrt(1.-r2);
  vec3 n=vec3(rot(-TILT)*q,z);
  float diff=smoothstep(-.08,.5,dot(n,L));
  // Soft latitude bands that drift slowly, darker toward the limb.
  float lat=q.y;
  float lon=atan(q.x,z)+t*.05;
  float b=sin(lat*8.+fbm(vec2(lon*1.5,lat*3.)+t*.02)*1.3)*.5+sin(lat*21.)*.12;
  vec3 surf=mix(mix(pale,amber,.45),violet*1.3,.5-.5*b);
  surf=mix(surf,pale,smoothstep(.75,1.,lat)*.5);
  // The ring's shadow: follow the ray from this point toward the light to the ring plane,
  // and darken by how dense the ring is where it crosses. Gaps let the light through.
  vec3 np=vec3(q,z);
  float t1=-dot(np,RING_N)/dot(Lp,RING_N);
  float shade=1.;
  if(t1>0.){
   vec3 X=np+Lp*t1;
   float rr=(length(vec2(X.x,dot(X,RING_D)))-1.25)/(2.3-1.25);
   if(rr>0.&&rr<1.) shade=1.-.7*ringProfile(rr)*smoothstep(.0,.25,diff);
  }
  col=surf*(.03+.72*diff)*pow(z,.3)*shade;
  col+=ice*pow(1.-z,4.)*.35*diff;
 } else {
  float d=sqrt(r2)-1.;
  float lit=max(dot(vec3(rot(-TILT)*normalize(q),0.),L),0.);
  col+=ice*exp(-d*22.)*(.08+.55*lit);
 }
 if(!behind && ring>0.){
  // The planet's shadow on the ring: from this ring point, does the ray toward the light
  // pass through the planet? Soft at the edge, and it lands mostly on the far side.
  vec3 P=vec3(q.x,0.,0.)+RING_D*(q.y/RING_SIN);
  float bb=dot(P,Lp);
  float closest=sqrt(max(dot(P,P)-bb*bb,0.));
  float inShadow=(1.-smoothstep(.93,1.05,closest))*smoothstep(0.,-.2,bb);
  float planetShadow=1.-.82*inShadow;
  vec3 ringCol=mix(mix(pale,amber,.45),vec3(1.),.25);
  col=mix(col,ringCol*(.3+.95*ring)*planetShadow,clamp(ring*1.7,0.,1.));
 }
 return col;
}

// Swell height at a point on the sea, in perspective.
float swell(vec2 p){
 float t=u_time;
 float z=.32/(HORIZON-p.y+.012);
 float wx=p.x*z;
 return sin(wx*2.2+z*1.7-t*1.1)*.5+sin(wx*-1.3+z*2.9+t*.8)*.35+sin(wx*4.7-z*.9+t*1.7)*.15;
}

vec3 scene(vec2 p, vec2 cell){
 if(p.y>HORIZON) return sky(p,cell);
 float aspect=u_resolution.x/u_resolution.y;
 float t=u_time;
 vec3 ice=u_color, L=lightDir();
 float v=HORIZON-p.y;
 // Surface slope from the swells, by finite differences.
 float h=swell(p);
 const float E=.004;
 vec2 slope=vec2(swell(p+vec2(E,0.))-h,swell(p-vec2(0.,E))-h)/E*.012*(.3+v*2.5);
 // Pointer ripples: rings that tilt the surface, flattened by perspective and damped as
 // they spread. They fade in as the pointer drops below the horizon.
 vec2 m=vec2((u_mouse.x-.5)*aspect,u_mouse.y-.5);
 float onSea=smoothstep(HORIZON-.02,HORIZON-.14,m.y);
 vec2 dm=(p-m)*vec2(1.,2.8);
 float dist=length(dm)+1e-4;
 float phase=dist*46.-t*5.;
 float damp=exp(-dist*7.)*smoothstep(0.,.015,dist);
 float dr=(cos(phase)*46.-sin(phase)*7.)*damp;
 slope+=onSea*dr*(dm/dist)*vec2(1.,2.8)*.002;
 // Mirror the sky, a little compressed, and let the slope bend what the water shows.
 vec2 rp=vec2(p.x,HORIZON+v*.8)+slope*vec2(.9,1.6);
 vec2 rcell=floor((rp*u_resolution.y+.5*u_resolution)/CELL);
 float fresnel=mix(.95,.4,clamp(v*1.4,0.,1.));
 vec3 col=sky(rp,rcell)*fresnel*vec3(.86,.9,1.);
 // Facets turned toward the light catch a little of it; the far water hazes over.
 float facing=dot(normalize(vec3(-slope*6.,1.)),normalize(vec3(L.x,.35,.9)));
 col+=pale*pow(max(facing,0.),40.)*.25*exp(-v*1.4);
 col+=pale*.05*(h*.5+.5)*exp(-v*1.6);
 col+=ice*.24*exp(-v*14.);
 return col;
}

// Glyphs drawn from simple shapes, densest last: . : - + x # @
float glyph(vec2 g, float level){
 vec2 d=abs(g-.5);
 float dot1=step(length((g-vec2(.5,.22))*vec2(1.,1.6)),.12);
 if(level<1.) return 0.;
 if(level<2.) return dot1;
 if(level<3.) return max(dot1,step(length((g-vec2(.5,.62))*vec2(1.,1.6)),.12));
 float h=step(d.y,.06)*step(d.x,.32);
 if(level<4.) return h;
 float v=step(d.x,.08)*step(d.y,.3);
 if(level<5.) return max(h,v);
 vec2 r=rot(.6)*(g-.5)*vec2(1.,.62);
 vec2 r2=rot(-.6)*(g-.5)*vec2(1.,.62);
 float x=max(step(abs(r.x),.06)*step(abs(r.y),.3),step(abs(r2.x),.06)*step(abs(r2.y),.3));
 if(level<6.) return max(x,h);
 float hash2=max(step(abs(abs(g.y-.5)-.14),.05)*step(d.x,.34),step(abs(abs(g.x-.5)-.15),.06)*step(d.y,.34));
 if(level<7.) return hash2;
 return step(d.x,.36)*step(d.y,.36)*(1.-step(length((g-.5)*vec2(1.,.6)),.13));
}

void main(){
 vec2 cell=floor(gl_FragCoord.xy/CELL);
 vec2 center=(cell+.5)*CELL;
 vec2 p=(center-.5*u_resolution)/u_resolution.y;
 vec3 col=scene(p,cell);
 float lum=dot(col,vec3(.3,.59,.11));
 // Lift the midtones so lit surfaces fill with denser glyphs.
 float level=floor(pow(clamp(lum*1.05,0.,1.),.78)*7.99);
 float g=glyph(fract(gl_FragCoord.xy/CELL),level);
 vec3 tone=mix(col/max(lum,.04)*.8,vec3(1.),clamp((lum-.7)*2.,0.,.6));
 vec3 o=tone*g*clamp(.35+lum*1.4,0.,1.)+col*.06;
 gl_FragColor=vec4(o,1.);
}`;

export function PlanetShader({
  color = "#a5b4fc",
  speed = 0.8,
  label = "A ringed planet rising over a sea, drawn in ASCII",
}: {
  color?: string;
  speed?: number;
  label?: string;
}) {
  return <ShaderCanvas fragment={fragment} color={color} speed={speed} label={label} maxPixelRatio={2} />;
}
