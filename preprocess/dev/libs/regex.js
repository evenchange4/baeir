"use strict";

// example: "@uMLLV3ZCO：", "@uMLLV3ZO："
export const mention = /@u(\S){7,8}：/g;     

// example: "@ukn："
export const mentionUkn = /@ukn：/g;        

// example: "http://", "https://"
export const url = /http(s)*:\/\//g;        

// example: "POINT(121.62397 31.10708)"
export const geo = /POINT\((.)*\)/g;        

// 表情 example: [崩潰]
export const expression = /\[([^\[\]]*)\]/g;

// 話題 example: #終極一班#
export const topic = /#([^#]*)#/g;           