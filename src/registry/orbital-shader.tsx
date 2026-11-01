"use client";
import { ShaderCanvas } from "./shader-canvas";
const fragment = `precision mediump float;
uniform vec2 u_resolution;uniform vec2 u_mouse;uniform float u_time;uniform vec3 u_color;
void main(){vec2 p=(gl_FragCoord.xy-.5*u_resolution)/u_resolution.y;p+=(u_mouse-.5)*.16;float r=length(p);float a=atan(p.y,p.x);float t=u_time*.28;float rings=sin(r*28.0-a*2.0+t*2.0+sin(a*3.0+t)*.8);float band=pow(.5+.5*rings,8.0);float fall=1.0-smoothstep(.22,.8,r);float core=smoothstep(.13,.22,r);vec3 c=vec3(.025,.018,.04)+u_color*band*fall*core;float rim=exp(-abs(r-.22)*70.0);c+=vec3(.85,.75,1.0)*rim*.7;c+=u_color*.06/(r+.15);gl_FragColor=vec4(c,1.0);}`;
export function OrbitalShader({
  color = "#b398f3",
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
      label="Orbital field"
    />
  );
}
