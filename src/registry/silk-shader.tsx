"use client";
import { ShaderCanvas } from "./shader-canvas";
const fragment = `precision mediump float;
uniform vec2 u_resolution; uniform float u_time; uniform vec3 u_color;
void main(){
 vec2 uv=gl_FragCoord.xy/u_resolution.xy; vec2 p=(uv-.5)*vec2(u_resolution.x/u_resolution.y,1.0);
 float t=u_time*.18;
 float fold=sin(p.x*2.7+p.y*3.2+t+sin(p.y*2.0-t)*1.3);
 float ribbon=pow(.5+.5*sin(fold*4.0+p.x*2.0-t),4.0);
 float soft=pow(.5+.5*sin(fold*3.0+p.y*2.5+t*.6),2.0);
 float grain=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)*.025;
 vec3 c=vec3(.018,.023,.045)+u_color*(ribbon*.65+soft*.14);
 c+=vec3(.23,.34,.55)*pow(ribbon,5.0)*.3;
 gl_FragColor=vec4(c+grain,1.0);
}`;
export function SilkShader({
  color = "#385dff",
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
      label="Silk field"
      interactive={false}
    />
  );
}
