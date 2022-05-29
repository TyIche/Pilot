#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;

layout(set = 0, binding = 1) uniform sampler2D color_grading_lut_texture_sampler;

layout(location = 0) out highp vec4 out_color;

void main()
{
    highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0);
    highp vec4 color       = subpassLoad(in_color).rgba;

    
    highp float height = float(lut_tex_size.y) - 1.0,width = float(lut_tex_size.x);
    highp float z0 = floor(color.z * height),z1 = ceil(color.z * height);
    highp vec2 uv0 = vec2(color.x * height + z0 * (height + 1.0),color.y);
    highp vec2 uv1 = vec2(color.x * height + z1 * (height + 1.0),color.y);
    uv0.x /= width;uv1.x /= width;
    color = mix(texture(color_grading_lut_texture_sampler,uv0),
    texture(color_grading_lut_texture_sampler,uv1),fract(color.z * height));

    out_color = color;
}
