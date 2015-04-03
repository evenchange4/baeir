export const mention = /@(\S){8,9}：/g;     // example: "@uMLLV3ZCO：", "@uMLLV3ZO："
export const mentionUkn = /@ukn：/g;        // example: "@ukn："
export const url = /http(s)*:\/\//g;        // example: "http://", "https://"
export const geo = /POINT\((.)*\)/g;        // example: "POINT(121.62397 31.10708)"
export const expression = /\[([^\[\]]*)\]/g;// 表情 ex: [崩潰]
export const topic = /#(\S)+#/g;            // 話題 ex: #終極一班#