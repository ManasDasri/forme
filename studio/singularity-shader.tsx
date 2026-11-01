"use client";
import { ShaderCanvas } from "./shader-canvas";

const fragment = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_resolution; uniform vec2 u_mouse; uniform float u_time; uniform vec3 u_color;
float hash(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float disk(vec2 p,float rs,float t){
 vec2 d=vec2(p.x,p.y*3.4);float dr=length(d);
 float body=smoothstep(.62,.2,dr)*smoothstep(rs*1.05,rs*1.7,dr);
 float swirl=.55+.45*sin(atan(d.y,d.x)*5.0-dr*22.0+t*2.4);
 return body*swirl*(1.25-dr*1.4)*(1.0+.7*p.x/.6);
}
void main(){
 vec2 p=(gl_FragCoord.xy-.5*u_resolution)/u_resolution.y;
 p-=(u_mouse-.5)*vec2(.18,.12);
 float t=u_time,r=length(p),rs=.15;
 vec2 q=p*(1.0+rs*rs*1.6/(r*r+.002));
 float star=step(.9975,hash(floor(q*160.0)))*(.65+.35*sin(t+hash(floor(q*160.0))*30.0));
 vec3 c=vec3(.004,.004,.012)+vec3(star)*smoothstep(rs,rs*1.8,r);
 float arch=exp(-abs(r-rs*1.6)*38.0)*smoothstep(-.03,.12,p.y);
 c+=u_color*arch*(.7+.3*sin(atan(p.y,p.x)*7.0-t*2.0));
 c+=u_color*disk(p,rs,t)*step(0.0,p.y)*.9;
 c+=mix(u_color,vec3(1.0),.35)*exp(-abs(r-rs*1.2)*160.0)*.75;
 c+=u_color*.05/(r*4.0+.2);
 c*=smoothstep(rs*.96,rs*1.04,r);
 c+=mix(u_color,vec3(1.0,.85,.7),.35)*disk(p,rs,t)*step(p.y,0.0);
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
