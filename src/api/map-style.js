/* eslint-disable */
export default [
  { //水系
    featureType: "water",
    elementType: "all",
    stylers: {
      // color: "#021019"
      "color": "#044161"
    }
  },
  { //地
    featureType: "land",
    elementType: "all",
    stylers: {
      color: "#08304b"
      // "color": "#004981"
    }
  },
  { //绿地 几何
    featureType: "green",
    elementType: "geometry",
    stylers: {
      // color: "#062032"
      "color": "#056197",
      "visibility": "off"
    }
  },
  { //边界线
    featureType: "boundary",
    elementType: "all",
    stylers: {
      "color": "#029fd4"
    }
  },
  { //人造区域
    featureType: "manmade",
    elementType: "all",
    stylers: {
      color: "#022338"
    }
  },
  { //建筑物 填充
    featureType: "building",
    elementType: "geometry.fill",
    stylers: {
      color: "#000000"
    }
  },
  { //建筑物 几何
    featureType: "building",
    elementType: "geometry",
    stylers: {
      color: "#022338"
    }
  },
  { //高速 填充
    featureType: "highway",
    elementType: "geometry.fill",
    stylers: {
      color: "#000000",
      "visibility": "off"
    }
  },
  { //高速 边框
    featureType: "highway",
    elementType: "geometry.stroke",
    stylers: {
      color: "#147a92",
      "visibility": "off"
    }
  },
  { //高速 文本
    "featureType": "highway",
    "elementType": "labels",
    "stylers": {
      "visibility": "off",
      "color": "#8b8787",
      "weight": "1",
      "lightness": -29
    }
  },
  { //铁路 填充
    featureType: "railway",
    elementType: "geometry.fill",
    stylers: {
      color: "#000000",
      // "visibility": "off"
    }
  },
  { //铁路 边框
    featureType: "railway",
    elementType: "geometry.stroke",
    stylers: {
      color: "#08304b",
    }
  },
  { //铁路
    "featureType": "railway",
    "elementType": "all",
    "stylers": {
      "visibility": "off"
    }
  },
  { //地铁 几何
    featureType: "subway",
    elementType: "geometry",
    stylers: {
      lightness: -70
    }
  },
  { //地铁
    "featureType": "subway",
    "elementType": "all",
    "stylers": {
      "visibility": "off"
    }
  },
  { //城市主路 几何填充
    featureType: "arterial",
    elementType: "geometry.fill",
    stylers: {
      color: "#000000"
    }
  },
  { //城市主路 几何边框
    featureType: "arterial",
    elementType: "geometry.stroke",
    stylers: {
      color: "#0b3d51"
    }
  },
  { //城市主路 文本
    "featureType": "arterial",
    "elementType": "labels",
    "stylers": {
      "color": "#8b8787",
      "weight": "1",
      "lightness": -29
    }
  },
  { //普通道路 几何
    featureType: "local",
    elementType: "geometry",
    stylers: {
      color: "#000000"
    }
  },
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: {
      color: "#857f7f"
    }
  },
  {
    featureType: "all",
    elementType: "labels.text.stroke",
    stylers: {
      color: "#000000"
    }
  }
]
