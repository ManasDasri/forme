"use client";
import { ShaderCanvas } from "./shader-canvas";

// Large, slow forms of polished metal reflecting softbox strips on black.
// A faint thin-film sheen appears only at grazing angles.
const fragment = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_resolution; uniform vec2 u_mouse; uniform float u_time; uniform vec3 u_color;
float field(vec2 p,float t){
 vec2 q=p+.4*vec2(sin(p.y*1.2+t*.25),cos(p.x*1.05-t*.2));
 q+=.18*vec2(sin(q.y*2.3-t*.3),cos(q.x*2.1+t*.22));
 return sin(q.x*1.5+t*.18)*cos(q.y*1.3-t*.14)+.55*sin(sqrt(dot(q,q)*1.56+.35)*2.1-t*.35);
}
vec3 studio(vec3 r,float t){
 float top=smoothstep(.5,.6,r.y)*smoothstep(.97,.82,r.y);
 float right=smoothstep(.07,.0,abs(r.x-.42-.04*sin(t*.2)))*smoothstep(-.3,.25,r.y);
 float left=smoothstep(.035,.0,abs(r.x+.58))*smoothstep(-.1,.4,r.y)*.55;
 vec3 c=vec3(1.0)*(top*1.5+right*1.1+left);
 c+=u_color*pow(max(-r.y,0.0),1.6)*.4;
 c+=vec3(.05)*max(r.y,0.0);
 return c;
}
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.0,1.0);}
void main(){
 vec2 p=(gl_FragCoord.xy-.5*u_resolution)/u_resolution.y*2.1;
 p+=(u_mouse-.5)*.08;
 float t=u_time,e=.01;
 float h=field(p,t),hx=field(p+vec2(e,0.0),t),hy=field(p+vec2(0.0,e),t);
 vec3 n=normalize(vec3((h-hx)*.5,(h-hy)*.5,e));
 vec3 r=reflect(vec3(0.0,0.0,-1.0),n);
 float f=pow(1.0-max(n.z,0.0),3.0);
 vec3 film=.5+.5*cos(6.2831*(f*1.6+vec3(0.0,.33,.67)));
 vec3 c=studio(r,t)*(.45+.75*f)+film*f*.16;
 c=aces(c);
 c*=1.0-.35*smoothstep(.6,1.5,length(p));
 gl_FragColor=vec4(c,1.0);
}`;

export function ChromeShader({
  color = "#7c9cff",
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
      label="Liquid chrome"
    />
  );
}
