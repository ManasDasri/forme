"use client";
import { ShaderCanvas } from "./shader-canvas";

// Shafts of light falling from above the frame, shimmering slowly, with drifting dust.
const fragment = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_resolution; uniform float u_time; uniform vec3 u_color;
float hash(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float noise(float x){float i=floor(x),f=fract(x);return mix(hash(vec2(i,1.)),hash(vec2(i+1.,1.)),f*f*(3.-2.*f));}
void main(){
 vec2 uv=gl_FragCoord.xy/u_resolution;
 float ar=u_resolution.x/u_resolution.y;
 vec2 p=vec2((uv.x-.5)*ar,uv.y);
 vec2 src=vec2(-.15*ar,1.35);
 vec2 d=p-src;
 float a=atan(d.x,-d.y);
 float r=length(d);
 float t=u_time*.25;
 float rays=0.;
 rays+=pow(noise(a*22.+t*1.3),3.)*.9;
 rays+=pow(noise(a*41.-t*1.9+7.),4.)*.6;
 rays+=pow(noise(a*9.+t*.7+3.),2.)*.5;
 float fall=smoothstep(1.9,.2,r)*smoothstep(-.35,.25,a)*smoothstep(1.15,.55,a);
 vec3 c=vec3(.004,.006,.012)+u_color*rays*fall*.75;
 c+=mix(u_color,vec3(1.),.6)*.18*exp(-r*1.6);
 vec2 cell=floor(gl_FragCoord.xy/2.);
 float dust=step(.9965,hash(cell+floor(u_time*.3)))*fall;
 c+=vec3(dust)*.5;
 c=1.-exp(-c*1.4);
 c+=(hash(gl_FragCoord.xy+fract(u_time))-.5)*.012;
 gl_FragColor=vec4(c,1.0);
}`;

export function LightRaysShader({
  color = "#c8d8ff",
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
      label="Light rays"
      interactive={false}
    />
  );
}
