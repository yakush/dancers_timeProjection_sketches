precision highp float;

varying vec2 v_uv;

uniform sampler2D u_texture;

void main() {
    vec2 uvFlip = vec2(v_uv.x,1.0-v_uv.y);
    vec4 color = texture2D(u_texture, uvFlip);
    
    //gl_FragColor = vec4(color.rgb, color.a);
    gl_FragColor = vec4(color.rgb, 1.0);
}