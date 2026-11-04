"use client";
import { ShaderCanvas } from "./shader-canvas";

// Mercury: beads held together by surface tension, merging and pinching apart.
// Each bead is a metaball; its dome is shaded as mirror metal in a photo studio.
const fragment = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_resolution; uniform vec2 u_mouse; uniform float u_time; uniform vec3 u_color;
float field(vec2 p,float t,vec2 m){
 float f=0.0;
 for(int i=0;i<9;i++){
  float k=float(i);
  vec2 c=vec2(sin(t*(.13+k*.021)+k*2.4)*(.3+k*.075),cos(t*(.11+k*.017)+k*1.7)*(.14+k*.036));
  float r=.13+.075*fract(k*.618)+.012*sin(t*.4+k);
  f+=2.4*exp(-dot(p-c,p-c)/(r*r));
 }
 // One small bead drifts after the pointer and joins the others.
 f+=2.4*exp(-dot(p-m,p-m)/.0081);
 return f;
}
// Dome height: steep at the edge and still curving at the crown, like a real bead.
float dome(float f){return sqrt(max(log(max(f,1.0)),0.0))*.62;}
float box(vec2 r,vec2 c,vec2 size,float soft){
 vec2 d=abs(r-c)-size;
 return smoothstep(soft,-soft,max(d.x,d.y));
}
vec3 studio(vec3 r,float t){
 float y=r.y;
 // Mirror metal is all contrast: a white horizon falling to dark overhead,
 // a black line at the horizon itself, and a floor that barely lifts.
 vec3 sky=mix(vec3(1.05,1.07,1.1),vec3(.035,.04,.055),smoothstep(.02,.62,y));
 vec3 ground=mix(vec3(.004),mix(u_color,vec3(.42),.45)*.42,smoothstep(.04,.95,-y));
 vec3 c=mix(ground,sky,smoothstep(-.008,.008,y));
 c*=1.0-.97*exp(-y*y*2400.0);
 // Softbox windows give each bead its crisp, curved highlights.
 float drift=.02*sin(t*.2);
 c+=vec3(1.8)*box(r.xy,vec2(-.42+drift,.66),vec2(.2,.12),.012);
 c+=vec3(1.1)*box(r.xy,vec2(.5-drift,.5),vec2(.07,.2),.012);
 c+=mix(u_color,vec3(1.0),.5)*.5*box(r.xy,vec2(.1,-.72),vec2(.34,.05),.05);
 return c;
}
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.0,1.0);}
void main(){
 vec2 p=(gl_FragCoord.xy-.5*u_resolution)/u_resolution.y;
 vec2 m=(u_mouse-.5)*vec2(u_resolution.x/u_resolution.y,1.0);
 float t=u_time,e=.0025;
 float f=field(p,t,m),fx=field(p+vec2(e,0.0),t,m),fy=field(p+vec2(0.0,e),t,m);
 vec2 grad=vec2(fx-f,fy-f)/e;
 float px=1.0/u_resolution.y;
 float edge=clamp((f-1.0)/(length(grad)*px+1e-4)+.5,0.0,1.0);
 float z=dome(f);
 vec3 n=normalize(vec3((z-dome(fx))/e*.3,(z-dome(fy))/e*.3,1.0));
 vec3 r=reflect(vec3(0.0,0.0,-1.0),n);
 float rim=pow(1.0-max(n.z,0.0),3.0);
 vec3 metal=studio(r,t)*(.9+.25*rim);
 vec3 bg=vec3(.006,.007,.01)+u_color*.05*smoothstep(.15,1.0,f);
 gl_FragColor=vec4(aces(mix(bg,metal,edge)),1.0);
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
