"use client";
import { ShaderCanvas } from "./shader-canvas";

// Topographic contour lines over a slowly shifting landscape. Lines are anti-aliased
// from the height field's own gradient, and every fifth line is an index line.
const fragment = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_resolution; uniform vec2 u_mouse; uniform float u_time; uniform vec3 u_color;
float hash(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float noise(vec2 p){
 vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.0-2.0*f);
 return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
}
float height(vec2 p,float t){
 float h=0.0,a=.55;
 vec2 q=p+vec2(t*.04,-t*.025);
 for(int i=0;i<4;i++){h+=a*noise(q);q=q*2.03+vec2(1.7,9.2)+t*.015;a*=.5;}
 return h;
}
void main(){
 vec2 p=(gl_FragCoord.xy-.5*u_resolution)/u_resolution.y*2.4;
 p+=(u_mouse-.5)*.08;
 float t=u_time;
 float levels=22.0;
 float h=height(p,t)*levels;
 float e=1.5/u_resolution.y*2.4;
 vec2 g=vec2(height(p+vec2(e,0.),t)-height(p-vec2(e,0.),t),height(p+vec2(0.,e),t)-height(p-vec2(0.,e),t))*levels/(2.*e);
 float px=length(g)*(2.4/u_resolution.y)+1e-4;
 float d=abs(fract(h)-.5)*2.0;
 float dist=(1.0-d)*.5/px;
 float line=1.0-smoothstep(.5,1.5,dist);
 float index=step(mod(floor(h+.5),5.0),.5);
 float lineIndex=1.0-smoothstep(.75,1.8,dist);
 vec3 c=vec3(.006,.008,.012);
 c+=u_color*.035*(h/levels);
 c+=mix(u_color*.32,mix(u_color,vec3(1.0),.2)*.85,index)*mix(line,lineIndex,index);
 float vignette=1.0-.45*smoothstep(.6,1.9,length(p));
 gl_FragColor=vec4(c*vignette,1.0);
}`;

export function ContoursShader({
  color = "#6ee7b7",
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
      label="Contours"
    />
  );
}
