"use client";
import { ShaderCanvas } from "./shader-canvas";

// The limb of a planet at night: a thin rim of light, a soft atmosphere, and a
// sunrise that drifts along the curve. The pointer moves the light source.
const fragment = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_resolution; uniform vec2 u_mouse; uniform float u_time; uniform vec3 u_color;
float hash(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
void main(){
 vec2 p=(gl_FragCoord.xy-.5*u_resolution)/u_resolution.y;
 vec2 center=vec2(0.0,-1.32);
 float radius=1.1;
 float d=length(p-center)-radius;
 float angle=atan(p.x-center.x,p.y-center.y);
 float sun=(u_mouse.x-.5)*.9+sin(u_time*.12)*.35;
 float light=pow(max(0.0,cos(angle-sun)),5.0);
 float rim=exp(-abs(d)*90.0)*(.25+1.6*light);
 float atmosphere=exp(-max(d,0.0)*6.0)*step(0.0,d)*(.08+.9*light);
 float surface=exp(d*10.0)*step(d,0.0)*(.03+.35*light);
 float haze=exp(-max(d,0.0)*1.6)*step(0.0,d)*.06;
 vec3 tint=mix(u_color,vec3(1.0,.86,.72),light*.45);
 vec3 c=tint*(atmosphere+surface+haze)+mix(tint,vec3(1.0),.65)*rim;
 vec2 cell=floor(gl_FragCoord.xy/1.5);
 float star=step(.9978,hash(cell))*smoothstep(.05,.6,d);
 c+=star*(.35+.25*sin(u_time*1.7+hash(cell+7.0)*40.0));
 c+=(hash(gl_FragCoord.xy+fract(u_time))-.5)*.018;
 gl_FragColor=vec4(c,1.0);
}`;

export function HorizonShader({
  color = "#6f8bff",
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
      label="Horizon"
    />
  );
}
