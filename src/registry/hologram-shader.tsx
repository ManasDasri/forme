"use client";
import { ShaderCanvas } from "./shader-canvas";

const fragment = `precision mediump float;
uniform vec2 u_resolution; uniform vec2 u_mouse; uniform float u_time; uniform vec3 u_color;
float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
float field(vec2 p,vec2 m,float t){
 float a=length(p-m),b=length(p+vec2(.32,.12)-m*.3);
 return .5+.5*sin((a-b*.7)*46.0-t*2.2)*cos(p.y*7.0+t*.7);
}
void main(){
 vec2 uv=gl_FragCoord.xy/u_resolution;
 float ar=u_resolution.x/u_resolution.y;
 vec2 p=(uv-.5)*vec2(ar,1.0);
 vec2 m=(u_mouse-.5)*vec2(ar,1.0)*.5;
 float t=u_time;
 float row=floor(uv.y*36.0);
 float glitch=step(.975,hash(vec2(row,floor(t*5.0))));
 p.x+=glitch*(hash(vec2(row,t))-.5)*.08;
 float s=.012;
 vec3 band=vec3(field(p+vec2(s,0),m,t),field(p,m,t),field(p-vec2(s,0),m,t));
 vec3 foil=mix(u_color,vec3(1.0,.42,.88),.5+.5*sin(p.x*2.5-p.y*1.5+t*.4));
 vec3 c=vec3(.01,.012,.03)+foil*pow(band,vec3(3.0))*.95+u_color*.06;
 c*=.82+.18*sin(gl_FragCoord.y*1.4+t*8.0);
 c+=glitch*u_color*.12;
 float vignette=1.0-.45*smoothstep(.25,1.0,length(p));
 gl_FragColor=vec4(c*vignette,1.0);
}`;

export function HologramShader({
  color = "#5cf2d6",
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
      label="Hologram"
    />
  );
}
