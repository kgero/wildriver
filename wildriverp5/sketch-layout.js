// string is text to write
// curveArray is list of [x,y] pairs
function textOnCurve(string, curveArray) {
  w = curveArray[0][0];
  var txtIdx = 0;

  for (var i = 1; i < curveArray.length; i++) {
    var y = curveArray[i][1];
    var x = curveArray[i][0];
    // circle(curveArray[i][0], curveArray[i][1], 1);
    if (x > w) {
      push();
      translate(x,y);
      rotate(getPerpAngle(x, y, curveArray[i-1][0], curveArray[i-1][1]));
      var char = string.substring(txtIdx, txtIdx+1);
      text(char, 0, 0);
      txtIdx++;
      pop();
      w += textWidth(char) + 1;
    }
  }
}

// given two points, return angle perpendicular to the line they create
function getPerpAngle(x1, y1, x2, y2) {
  var ox1 = x2 - x1;
  var oy1 = y2 - y1;
  return atan2(oy1, ox1) + PI;
}


// get array of noisy curve coordinates
// start, stop are [x,y] coordinates pairs
function getStartStopCurve(start, stop) {
  // perlin noise curve
  noiseSeed(random()*100);
  var curve = [];
  var xsteps = abs(start[0] - stop[0]);
  var ystepsize = (stop[1] - start[1])/xsteps;
  var ystep = start[1];
  var fade = 0;
  for (var i = 0; i < xsteps; i++) {
    ystep += ystepsize;
    fade = min(i, 100);
    fade = min(fade, xsteps-i);
    var y = ystep; // + ( 100 * noise(i * 0.0015) );
    var x = start[0] + i;
    append(curve, [x, y]);
  }
  return curve;
}

function addPerlinNoise(curve) {
  noiseSeed(random()*100);
  var newCurve = [];
  for (var i = 0; i < curve.length-1; i++) {
    var y = curve[i][1] + ( 100 * noise(i * 0.002) );
    var x = curve[i][0];
    append(newCurve, [x,y]);
  }
  return newCurve;
}

// return control point from end of curve
function getControlPointEnd(curve, controlLen) {
  var end = curve[curve.length-1];
  var preend = curve[curve.length-controlLen];
  var x1 = preend[0]; var y1 = preend[1];
  var x2 = end[0]; var y2 = end[1];
  var xc = x2 + 2*(x2-x1);
  var yc = y2 + 2*(y2-y1);
  return [xc, yc];
}

function getControlPointStart(curve, controlLen) {
  var start = curve[0];
  var poststart = curve[controlLen];
  var x1 = poststart[0]; var y1 = poststart[1];
  var x2 = start[0]; var y2 = start[1];
  var xc = x2 + 2*(x2-x1);
  var yc = y2 + 2*(y2-y1);
  return [xc, yc];
}

// return an array of [x,y] points that smoothly connects curve1 to curve2
function getGapCurve(curve1, curve2) {
  var start = curve1[curve1.length-1];
  var stop = curve2[0];
  var control1 =  getControlPointEnd(curve1, 15);
  var control2 = getControlPointStart(curve2, 15);
  // line(start[0], start[1], control1[0], control1[1]);
  // line(stop[0], stop[1], control2[0], control2[1]);

  var x1 = start[0];
  var y1 = start[1];
  var x2 = control1[0]; 
  var y2 = control1[1];
  var x3 = control2[0];
  var y3 = control2[1];
  var x4 = stop[0];
  var y4 = stop[1];
  // bezier(x1, y1, x2, y2, x3, y3, x4, y4);
  var curve = [];
  let steps = 100;
  for (let i = 0; i <= steps; i++) {
    let t = i / steps;
    let x = bezierPoint(x1, x2, x3, x4, t);
    let y = bezierPoint(y1, y2, y3, y4, t);
    append(curve, [x,y]);
  }
  return curve;
}

// return curve of curve1 and curve2 connect smoothly
// assumes end of curve1 is start of curve2
// dist is the amount to cut out for the connection
function connectTwoCurves(curve1, curve2, dist) {
  // cut of end of curve1, then use a gap curve to connect the two
  curve1 = subset(curve1, 0, curve1.length-dist);
  var gapCurve = getGapCurve(curve1, curve2, dist);
  return concat(concat(curve1, gapCurve), curve2);
}

function shiftCurve(curve, shift) {
  var newcurve = [];
  for (var i = 0; i < curve.length-1; i++) {
    append(newcurve, [curve[i][0], curve[i][1]+shift]);
  }
  return newcurve;
}

function setup() {
  createCanvas(2000, 1000);

  var list_o_words = [
    "Long before the economic crisis of 2007-2008, this far-reaching multi-disciplinary effort integrated history, sociology, management, and economics to explain why today's business models have reached the limits of their adaptive range",
    "Decades of early research on the genetics of depression were built on nonexistent foundations. How did that happen? See how changing it's value causes more or less letters to appear, as it is the value used as the limit when looping over letters",
    "In theory, anyone who had this particular gene variant could be at higher risk for depression, and that finding, they said, might help in diagnosing such disorders, assessing suicidal behavior, or even predicting a person's response to antidepressants.",
    "I have 3 young adult boys 26 ,23,21 they all have paranoid schizophrenia . 2 comply and the oldest refuses meds. Its hard to live on ihss pay. I get atotal of 20 hpurs approved for 2 kids and since thw oldeat has it worst he dpesnt want help from anyone so i dont get any money for him. He wakes up screaming arguing with these voixes as if theyre hurting him. I have to stay home and watch them so i cant work no where else. I need help to get my oldest help .",
    "Back then, tools for sequencing DNA weren't as cheap or powerful as they are today. When researchers wanted to work out which genes might affect a disease or trait, they made educated guesses, and picked likely 'candidate genes'."
    ];

  var list_o_curves = [];

  var overlap = [
    {"start": 70, "len": 50},
    {"start": 150, "len": 75},
    {"start": 100, "len": 75},
    {"start": 30, "len": 50}
    ];

  var y = 100;
  var curve = getStartStopCurve([0,y], [1500, y]);
  curve = addPerlinNoise(curve);
  append(list_o_curves, curve);
  textOnCurve(list_o_words[0], curve);

  for (var i=0; i<overlap.length; i++) {
    y += 100;
    lap = overlap[i];

    last_curve = list_o_curves[list_o_curves.length-1];
    last_text = list_o_words[i];
    var startx = textWidth(last_text.substring(0, lap.start));
    var endx = textWidth(last_text.substring(lap.start, lap.start+lap.len));

    var curve1 = addPerlinNoise(getStartStopCurve([0, y], [startx,y-100]));
    var curve2 = shiftCurve(subset(last_curve, startx, endx), 15);
    var curve3 = addPerlinNoise(getStartStopCurve(curve2[curve2.length-1], [1500, y]));
    curve = connectTwoCurves(curve1, curve2, 100);
    curve = connectTwoCurves(curve, curve3, 100);
    append(list_o_curves, curve);
    textOnCurve(list_o_words[i+1], curve);
  }

}

function draw() {
}
