export function regions([x, y, width, height]){
  return {x: x / 10, y: y / 10, width: width / 10, height: height / 10};
}

export function slide(dims){
  return {
    regions: dims.map(regions)
  };
}
