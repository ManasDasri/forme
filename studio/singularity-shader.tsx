"use client";
import { ShaderCanvas } from "./shader-canvas";

// A thin accretion disk seen almost edge-on. The far side is lensed over the
// top of the shadow, gas streaks orbit faster near the hole, the approaching
// side is beamed brighter, and the background is bent around the mass.
const fragment = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_resolution; uniform vec2 u_mouse; uniform float u_time; uniform vec3 u_color;
float hash(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float noise(vec2 p){
 vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.0-2.0*f);
 return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
}
float fbm(vec2 p){float v=0.0,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+17.1;a*=.5;}return v;}
vec3 heat(float x){
 vec3 hot=vec3(1.0,.96,.9),warm=mix(u_color,vec3(1.0,.8,.55),.25),cool=u_color*vec3(.55,.25,.15);
 return mix(mix(hot,warm,smoothstep(0.0,.35,x)),cool,smoothstep(.35,1.0,x));
}
vec3 disk(vec2 p,float rs,float t,out float mask){
 float tilt=.18;
 vec2 d=vec2(p.x,p.y/tilt);
 float r=length(d),a=atan(d.y,d.x);
 float inner=rs*1.55,outer=.62;
 mask=smoothstep(inner,inner*1.12,r)*smoothstep(outer,outer*.45,r);
 float x=clamp((r-inner)/(outer-inner),0.0,1.0);
 float orbit=a+t*.55/(r+.08);
 float gas=fbm(vec2(orbit*2.2,r*16.0))*.7+fbm(vec2(orbit*5.0,r*42.0))*.45;
 float beam=1.0-.62*clamp(d.x/(r+.001),-1.0,1.0);
 return heat(x)*mask*(.25+1.25*gas*gas)*beam*(1.7-1.3*x);
}
void main(){
 vec2 p=(gl_FragCoord.xy-.5*u_resolution)/u_resolution.y*.74;
 p-=(u_mouse-.5)*vec2(.08,.05);
 float t=u_time,rs=.11,r=length(p),a=atan(p.y,p.x);
 vec2 q=p*(1.0+rs*rs*3.2/(r*r+.0004));
 float neb=fbm(q*2.2+vec2(t*.01,0.0));
 vec3 c=vec3(.006,.007,.014)+mix(vec3(.10,.08,.25),vec3(.04,.12,.22),fbm(q*1.1+4.0))*pow(neb,3.0)*.55;
 vec2 cell=floor(q*230.0);
 c+=vec3(.9,.95,1.0)*step(.9982,hash(cell))*(.55+.45*sin(t*1.3+hash(cell+3.0)*40.0));
 float m;
 vec3 back=disk(p,rs,t,m)*step(0.0,p.y);
 c=mix(c,back,m*step(0.0,p.y)*.9)+back*.25;
 float arch=exp(-abs(r-rs*1.72)*55.0)*smoothstep(-.2,.75,p.y/(r+.001));
 float under=exp(-abs(r-rs*1.42)*90.0)*smoothstep(.2,-.9,p.y/(r+.001))*.4;
 float streak=fbm(vec2(a*3.0+t*.9,r*30.0));
 c+=heat(.18)*(arch+under)*(.45+.9*streak);
 c*=smoothstep(rs*.97,rs*1.03,r);
 c+=vec3(1.0,.93,.85)*exp(-abs(r-rs*1.06)*420.0)*.5;
 vec3 front=disk(p,rs,t,m)*step(p.y,0.0);
 c=mix(c,front,m*step(p.y,0.0)*.85)+front*.3;
 c+=heat(.3)*.05*exp(-length(vec2(p.x*.5,p.y*3.0))*4.0);
 c=1.0-exp(-c*1.35);
 c=pow(c,vec3(.92));
 c+=(hash(gl_FragCoord.xy+fract(t))-.5)*.012;
 gl_FragColor=vec4(c,1.0);
}`;

export function SingularityShader({
  color = "#ff9b5c",
  speed = 1,
}: {
  color?: string;
  speed?: number;
}) {
  return (
    <ShaderCanvas
      fragment={fragment}
      color={color}
      speed={speed}
      label="Singularity"
    />
  );
}
