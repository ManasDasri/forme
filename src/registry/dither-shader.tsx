"use client";
import { ShaderCanvas } from "./shader-canvas";
const fragment = `precision mediump float;
uniform vec2 u_resolution;uniform vec2 u_mouse;uniform float u_time;uniform vec3 u_color;
float bayer(vec2 p){vec2 a=mod(p,2.0);vec2 b=mod(floor(p/2.0),2.0);return (4.0*(2.0*a.x+3.0*a.y-4.0*a.x*a.y)+(2.0*b.x+3.0*b.y-4.0*b.x*b.y)+.5)/16.0;}
void main(){vec2 cell=floor(gl_FragCoord.xy/3.0);vec2 uv=cell*3.0/u_resolution;vec2 p=(uv-.5)*vec2(u_resolution.x/u_resolution.y,1.0);float t=u_time*.25;
float waves=sin(p.x*4.5+t+cos(p.y*4.0-t))*cos(p.y*3.0+p.x*2.0-t*.7);float field=.12+.72*pow(.5+.5*waves,1.5);field+=.2*(1.0-smoothstep(0.0,.5,length(uv-u_mouse)));
float d=step(bayer(cell),clamp(field,0.0,1.0));float grid=step(.12,fract(gl_FragCoord.x/3.0))*step(.12,fract(gl_FragCoord.y/3.0));vec3 c=mix(vec3(.025,.035,.04),u_color,d*grid*.85);gl_FragColor=vec4(c,1.0);}`;
export function DitherShader({
  color = "#c5dacb",
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
      label="Dither terrain"
    />
  );
}
