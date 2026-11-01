"use client";
import { ShaderCanvas } from "./shader-canvas";

const fragment = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_resolution; uniform vec2 u_mouse; uniform float u_time; uniform vec3 u_color;
float hash(float n){return fract(sin(n*91.7)*43758.5453);}
void main(){
 vec2 p=(gl_FragCoord.xy-.5*u_resolution)/u_resolution.y;
 p-=(u_mouse-.5)*.35;
 float r=length(p),a=atan(p.y,p.x)/6.28318+.5;
 vec3 c=vec3(.004,.006,.02)+u_color*.07/(r*6.0+.25);
 for(int i=0;i<4;i++){
  float fi=float(i),n=48.0+fi*29.0;
  float seg=floor(a*n),h=hash(seg+fi*17.0);
  float z=fract(h*9.0+u_time*(.18+.22*h));
  float head=z*z*1.6,len=.015+.35*z*z;
  float across=abs(fract(a*n)-.5);
  float body=smoothstep(head-len,head,r)*step(r,head)*smoothstep(.16,.02,across);
  c+=mix(u_color,vec3(1.0),z*.7)*body*z*(1.4-fi*.2);
 }
 c+=u_color*.12*smoothstep(.9,0.0,r)*(.6+.4*sin(u_time*2.0));
 gl_FragColor=vec4(c,1.0);
}`;

export function WarpShader({
  color = "#9b8cff",
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
      label="Warp field"
    />
  );
}
