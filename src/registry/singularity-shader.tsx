"use client";
import { ShaderCanvas } from "./shader-canvas";

// Restraint over detail: a clean shadow, a smooth lensed halo, a thin disk
// crossing in front, soft bloom, and almost-empty space.
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
float fbm(vec2 p){float v=0.0,a=.5;for(int i=0;i<3;i++){v+=a*noise(p);p=p*2.02+11.3;a*=.5;}return v;}
vec3 warm(float x){return mix(vec3(1.0,.97,.92),u_color,smoothstep(0.0,1.0,x));}
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.0,1.0);}
void main(){
 vec2 p=(gl_FragCoord.xy-.5*u_resolution)/u_resolution.y*.95;
 p-=(u_mouse-.5)*vec2(.025,.015);
 float t=u_time,rs=.13,r=length(p),a=atan(p.y,p.x);
 vec2 q=p*(1.0+rs*rs*2.6/(r*r+.0004));
 vec2 cell=floor(q*260.0);
 vec3 c=vec3(.002,.002,.004)+vec3(.8,.85,1.0)*step(.9993,hash(cell))*.55*smoothstep(rs*1.3,rs*2.5,r);
 vec2 d=vec2(p.x,p.y/.055);
 float dr=length(d),inner=rs*1.45,outer=.75;
 float x=clamp((dr-inner)/(outer-inner),0.0,1.0);
 float beam=1.0-.5*clamp(d.x/(dr+.001),-1.0,1.0);
 float streak=.82+.18*fbm(vec2(atan(d.y,d.x)*1.6+t*.25/(dr+.15),dr*9.0));
 vec3 disk=warm(x)*pow(1.0-x,2.2)*smoothstep(inner,inner*1.1,dr)*step(dr,outer)*streak*beam*1.25;
 float side=1.0-.3*clamp(p.x/(r+.001),-1.0,1.0);
 float ring=r-rs*1.1;
 float halo=(ring<0.0?exp(-pow(ring/(rs*.05),2.0)):exp(-ring/(rs*.42)))*smoothstep(rs*1.0,rs*1.06,r)*(.3+.7*smoothstep(-1.0,1.0,p.y/(r+.001)))*side;
 float grain=.88+.12*fbm(vec2(a*2.0+t*.3,r*18.0));
 c+=warm(.28)*halo*grain*.95;
 c+=disk*step(0.0,p.y);
 c+=warm(.3)*.07*exp(-max(r-rs,0.0)*6.0);
 c*=smoothstep(rs*.97,rs*1.02,r);
 c+=vec3(1.0,.96,.9)*exp(-abs(r-rs*1.04)*700.0)*.45;
 c+=disk*step(p.y,0.0);
 c+=warm(.4)*.035*exp(-abs(p.y)*40.0)*exp(-abs(p.x)*1.8);
 c=aces(c*.9);
 c+=(hash(gl_FragCoord.xy+fract(t*7.0))-.5)*.008;
 gl_FragColor=vec4(c,1.0);
}`;

export function SingularityShader({
  color = "#e8a25c",
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
