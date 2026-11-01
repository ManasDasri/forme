"use client";
import { ShaderCanvas } from "./shader-canvas";

// Slow curtains of light: folds drift sideways, fine rays shimmer along each
// curtain, and the brightest edge sits low like the real thing. Ambient only.
const fragment = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_resolution; uniform float u_time; uniform vec3 u_color;
float hash(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float noise(vec2 p){
 vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.0-2.0*f);
 return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
}
float fbm(vec2 p){float v=0.0,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+7.7;a*=.5;}return v;}
void main(){
 vec2 uv=gl_FragCoord.xy/u_resolution;
 vec2 p=vec2(uv.x*u_resolution.x/u_resolution.y,uv.y);
 float t=u_time*.06;
 vec3 c=mix(vec3(.004,.006,.014),vec3(.01,.02,.04),uv.y);
 for(int i=0;i<3;i++){
  float fi=float(i);
  float fold=fbm(vec2(p.x*.7+fi*4.1,t*1.5+fi))*1.4;
  float base=.38+fi*.09+.12*sin(p.x*1.3+fold*2.2+t*4.0+fi*2.0);
  float above=p.y-base;
  float curtain=smoothstep(-.06,.02,above)*exp(-max(above,0.0)*(3.2+fi));
  float rays=.55+.45*pow(noise(vec2((p.x+fold*.3)*26.0,t*6.0+fi*9.0)),1.5);
  vec3 tint=mix(u_color,vec3(.55,.35,.95),fi/2.5);
  c+=tint*curtain*rays*(.75-fi*.18);
 }
 vec2 cell=floor(gl_FragCoord.xy/1.5);
 c+=vec3(.8,.85,1.0)*step(.9985,hash(cell))*.35*smoothstep(.4,1.0,uv.y);
 c=1.0-exp(-c*1.4);
 c+=(hash(gl_FragCoord.xy+fract(u_time))-.5)*.012;
 gl_FragColor=vec4(c,1.0);
}`;

export function AuroraShader({
  color = "#5eead4",
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
      label="Aurora"
      interactive={false}
    />
  );
}
