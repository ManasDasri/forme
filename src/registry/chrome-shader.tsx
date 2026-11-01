"use client";
import { ShaderCanvas } from "./shader-canvas";

// A domain-warped height field shaded as polished metal: normals from the
// field, reflected into a procedural studio, with Fresnel and a tinted floor bounce.
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
float fbm(vec2 p){
 float v=0.0,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);
 for(int i=0;i<3;i++){v+=a*noise(p);p=m*p;a*=.5;}
 return v;
}
float field(vec2 p,float t){
 vec2 q=vec2(fbm(p+vec2(0.0,t*.07)),fbm(p+vec2(5.2,1.3)-t*.06));
 return fbm(p+1.5*q);
}
vec3 studio(vec3 r,float t){
 float up=r.y*.5+.5;
 vec3 c=vec3(.015,.016,.02);
 c+=vec3(1.0)*pow(up,7.0)*1.25;
 c+=u_color*pow(1.0-up,3.0)*.75;
 c+=vec3(1.0)*smoothstep(.985,1.0,sin(r.x*2.6+t*.15)*.5+.5)*.9;
 c+=vec3(.9,.95,1.0)*smoothstep(.97,1.0,sin(r.x*1.3-r.y*2.0-t*.1)*.5+.5)*.35;
 return c;
}
void main(){
 vec2 p=(gl_FragCoord.xy-.5*u_resolution)/u_resolution.y*.95;
 p+=(u_mouse-.5)*.35;
 float t=u_time,e=.012;
 float h=field(p,t),hx=field(p+vec2(e,0.0),t),hy=field(p+vec2(0.0,e),t);
 vec3 n=normalize(vec3(h-hx,h-hy,e*.55));
 vec3 r=reflect(vec3(0.0,0.0,-1.0),n);
 float fresnel=pow(1.0-max(n.z,0.0),2.5);
 vec3 c=studio(r,t)*(.55+.6*fresnel);
 c=c/(1.0+c);
 c=pow(c,vec3(1.15));
 float vignette=1.0-.4*smoothstep(.5,1.6,length(p));
 gl_FragColor=vec4(c*vignette,1.0);
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
