"use client";
import { ShaderCanvas } from "./shader-canvas";

const fragment = `precision mediump float;
uniform vec2 u_resolution; uniform vec2 u_mouse; uniform float u_time; uniform vec3 u_color;
float hash(vec2 p){return fract(sin(dot(p,vec2(41.3,289.1)))*43758.5453);}
void main(){
 vec2 uv=gl_FragCoord.xy/u_resolution;
 vec2 p=(uv-.5)*vec2(u_resolution.x/u_resolution.y,1.0);
 float horizon=.06+(u_mouse.y-.5)*.08;
 vec3 c=vec3(.008,.01,.028);
 float above=p.y-horizon;
 if(above>0.0){
  c+=u_color*.42*exp(-above*7.0)+vec3(.55,.16,.75)*.14*exp(-above*2.2);
  vec2 cell=floor(gl_FragCoord.xy/2.0);
  float star=step(.9965,hash(cell))*smoothstep(.02,.3,above);
  c+=star*(.4+.6*sin(u_time*3.0+hash(cell+3.0)*40.0));
 }else{
  float d=-above;
  float z=.32/max(d,.002);
  float x=(p.x-(u_mouse.x-.5)*.3*(1.0-d*2.0))*z;
  vec2 g=vec2(x,z+u_time*1.2);
  vec2 f=abs(fract(g)-.5);
  float w=.03+.012*z;
  float lx=1.0-smoothstep(0.0,w,.5-f.x);
  float lz=1.0-smoothstep(0.0,w*1.4,.5-f.y);
  float line=max(lx,lz);
  float fade=exp(-z*.09);
  float pulse=exp(-abs(fract(z*.08-u_time*.35)-.5)*24.0);
  c+=u_color*line*fade*(1.1+1.4*pulse)+u_color*.25*exp(-d*9.0);
  c+=vec3(.5,.2,.8)*.06*fade;
 }
 c*=.9+.1*sin(gl_FragCoord.y*1.7);
 float vignette=1.0-.35*smoothstep(.2,1.0,length(p*vec2(.8,1.2)));
 gl_FragColor=vec4(c*vignette,1.0);
}`;

export function HorizonShader({
  color = "#38e1ff",
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
      label="Neon horizon"
    />
  );
}
