"use client";
import { ShaderCanvas } from "./shader-canvas";

const fragment = `precision mediump float;
uniform vec2 u_resolution; uniform vec2 u_mouse; uniform float u_time; uniform vec3 u_color;
vec2 hash(vec2 p){return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);}
vec2 cells(vec2 p,float t){
 vec2 tile=floor(p),local=fract(p);float nearest=9.0,second=9.0;
 for(int y=-1;y<=1;y++){for(int x=-1;x<=1;x++){
  vec2 neighbor=vec2(float(x),float(y));vec2 seed=hash(tile+neighbor);
  vec2 point=.5+.38*sin(t+6.28318*seed);float d=length(neighbor+point-local);
  if(d<nearest){second=nearest;nearest=d;}else{second=min(second,d);}
 }}return vec2(nearest,second-nearest);
}
void main(){
 vec2 uv=gl_FragCoord.xy/u_resolution;vec2 p=(uv-.5)*vec2(u_resolution.x/u_resolution.y,1.0);
 float t=u_time*.28;p+=(u_mouse-.5)*.12;
 vec2 q=p*3.1;
 q+=.38*sin(q.yx*1.8+vec2(t,-t*.8))+.16*sin(q.xy*3.4-t*.6);
 vec2 field=cells(q,t);
 float seam=exp(-field.y*38.0),halo=exp(-field.y*9.0);
 float focus=pow(max(0.0,1.0-field.x),3.0);
 float wash=.5+.5*sin(p.x*2.0-p.y*3.0+t);
 vec3 c=vec3(.006,.018,.035)+u_color*(.04+.18*focus+.15*halo);
 c+=mix(u_color,vec3(.92,.98,1.0),.65)*seam*.85;
 c+=vec3(.12,.07,.22)*halo*wash;
 float vignette=1.0-.38*smoothstep(.1,1.1,length(p));
 gl_FragColor=vec4(c*vignette,1.0);
}`;

export function CausticShader({
  color = "#73d9ed",
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
      label="Caustic glass"
    />
  );
}
