const vs = `#version 300 es
in vec4 a_position;
in vec3 a_normal;
in vec2 a_texcoord;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_world;

out vec3 v_normal;
// a varying to pass the texture coordinates to the fragment shader
out vec2 v_texcoord;

void main() {
  gl_Position = u_projection * u_view * u_world * a_position;
  v_normal = mat3(u_world) * a_normal;
  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}
`;

const fs = `#version 300 es
precision highp float;

in vec3 v_normal;
in vec2 v_texcoord;

uniform vec4 u_diffuse;
uniform vec3 u_lightDirection;
uniform sampler2D u_texture;

out vec4 outColor;

void main () {
  vec3 normal = normalize(v_normal);
  float fakeLight = dot(u_lightDirection, normal) * .5 + .5;
  outColor = vec4(u_diffuse.rgb * fakeLight, u_diffuse.a);
  outColor = texture(u_texture, v_texcoord);
}
`;