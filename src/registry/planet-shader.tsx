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
uniform vec2 u_resolution; uniform vec2 u_mouse; uniform float u_time; uniform vec3 u_color;
const vec2 CELL = vec2(7.0, 12.0);
const float HORIZON = -0.16;
float hash(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p*=2.03;a*=.5;}return v;}
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}

vec3 violet=vec3(.33,.27,.62), pale=vec3(.78,.82,1.0), amber=vec3(1.0,.86,.55);
const vec2 PLANET=vec2(0.0,HORIZON+.06);
const float R=.4;

vec3 lightDir(){return normalize(vec3((u_mouse.x-.5)*2.6,.55,.7));}

// Everything above the waterline: stars, horizon glow, the planet, and its ring.
vec3 sky(vec2 p, vec2 cell){
 float t=u_time;
 vec3 L=lightDir(), ice=u_color, col=vec3(0.0);
 vec2 c=PLANET;
 float s=hash(cell);
 col+=step(.985,s)*(.35+.3*sin(t*1.6+s*60.))*vec3(.85,.88,1.);
 col+=ice*.22*exp(-max(p.y-HORIZON,0.)*9.)*(.6+.4*exp(-abs(p.x-c.x)*1.4));
 vec2 q=(p-c)/R;
 float r2=dot(q,q);
 // Ring, tilted; its back half hides behind the planet.
 vec2 rq=rot(-.2)*(p-c);
 float e=length(vec2(rq.x/(R*2.05),rq.y/(R*.34)));
 float band=smoothstep(.66,.7,e)*smoothstep(1.0,.95,e)*(.72+.28*sin(e*90.))*(1.-.6*smoothstep(.8,.84,e)*smoothstep(.88,.84,e));
 bool behind=rq.y>0.0 && r2<1.0;
 float ringLight=.6+.4*clamp(.5+.5*dot(normalize(vec3(rq.x,0.,.4)),L),0.,1.);
 if(r2<1.0){
  float z=sqrt(1.-r2);
  vec3 n=vec3(q,z);
  float diff=max(dot(n,L),0.);
  // Cloud bands drift with latitude; turbulence bends them.
  float lon=atan(q.x,z)+t*.04;
  float lat=q.y;
  float b=sin(lat*13.+fbm(vec2(lon*2.4,lat*5.)+t*.03)*3.2);
  vec3 surf=mix(violet,pale,.5+.5*b);
  surf=mix(surf,amber,smoothstep(.55,1.,fbm(vec2(lon*4.,lat*9.)))*.55);
  // The ring's shadow falls across the disc.
  float shadow=1.-.65*smoothstep(.06,.0,abs(q.y+.05+q.x*.2))*step(0.,L.y);
  col=surf*(.03+.78*diff)*shadow;
  col+=ice*pow(1.-z,3.)*(.2+.7*diff);
 } else {
  float d=sqrt(r2)-1.;
  float lit=max(dot(vec3(normalize(q),0.),L),0.);
  col+=ice*exp(-d*14.)*(.12+.8*lit);
 }
 if(!behind) col+=mix(pale,amber,.35)*band*ringLight*.7;
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
 float level=floor(clamp(lum*1.05,0.,1.)*7.99);
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
  return <ShaderCanvas fragment={fragment} color={color} speed={speed} label={label} />;
}
