"use client";
import { ShaderCanvas } from "./shader-canvas";

// Four soft color fields drifting past each other, blended by distance, with fine grain.
const fragment = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_resolution; uniform float u_time; uniform vec3 u_color; uniform vec3 u_palette[4];
float hash(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
void main(){
 vec2 uv=gl_FragCoord.xy/u_resolution;
 vec2 p=uv*vec2(u_resolution.x/u_resolution.y,1.0);
 float t=u_time*.12;
 // Gentle domain warp so the fields fold instead of sliding in straight lines.
 p+=.08*vec2(sin(p.y*3.1+t*1.7),cos(p.x*2.7-t*1.3));
 float ar=u_resolution.x/u_resolution.y;
 vec2 c0=vec2(ar*(.25+.18*sin(t*.9)),.3+.2*cos(t*.7));
 vec2 c1=vec2(ar*(.75+.15*cos(t*.8)),.25+.2*sin(t*1.1));
 vec2 c2=vec2(ar*(.6+.2*sin(t*.6+2.)),.8+.15*cos(t*.9));
 vec2 c3=vec2(ar*(.2+.15*cos(t*1.2+1.)),.75+.2*sin(t*.5));
 float w0=1./pow(length(p-c0)+.18,2.6),w1=1./pow(length(p-c1)+.18,2.6);
 float w2=1./pow(length(p-c2)+.18,2.6),w3=1./pow(length(p-c3)+.18,2.6);
 vec3 c=(u_palette[0]*w0+u_palette[1]*w1+u_palette[2]*w2+u_palette[3]*w3)/(w0+w1+w2+w3);
 c+=(hash(gl_FragCoord.xy+fract(u_time))-.5)*.045;
 gl_FragColor=vec4(c,1.0);
}`;

export function MeshGradientShader({
  colors = ["#3b1dd4", "#e2187a", "#ff8a3d", "#0aa5c8"],
  speed = 1,
  label = "Mesh gradient",
}: {
  colors?: string[];
  speed?: number;
  label?: string;
}) {
  return (
    <ShaderCanvas
      fragment={fragment}
      color={colors[0]}
      palette={colors}
      speed={speed}
      label={label}
      interactive={false}
    />
  );
}
