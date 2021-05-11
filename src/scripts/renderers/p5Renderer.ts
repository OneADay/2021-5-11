import * as seedrandom from 'seedrandom';
import { BaseRenderer } from './baseRenderer';
import gsap from 'gsap';
import P5 from 'p5';

const srandom = seedrandom('b');

export default class P5Renderer implements BaseRenderer{

    recording: boolean = false;
    colors = ['#AA4465', '#861657', '#93E1D8', '#DDFFF7'];
    backgroundColor = '#654F6F';

    canvas: HTMLCanvasElement;
    s: any;

    completeCallback: any;
    delta = 0;
    animating = true;

    width: number = 1920 / 2;
    height: number = 1080 / 2;

    size: number;

    x: number;
    y: number;

    frameCount = 0;
    totalFrames = 1000;

    constructor(w, h) {

        this.width = w;
        this.height = h;

        const sketch = (s) => {
            this.s = s;
            s.pixelDensity(1);
            s.setup = () => this.setup(s)
            s.draw = () => this.draw(s)
        }

        new P5(sketch);
    }

    protected setup(s) {
        let renderer = s.createCanvas(this.width, this.height);
        this.canvas = renderer.canvas;

        s.noiseSeed(99);
        let bg = s.color(this.backgroundColor);
        s.background(bg);
        s.rectMode(s.CENTER);

        //s.colorMode(s.HSB);
    }

    protected draw(s) {

        if (this.animating) { 
            this.frameCount += 5;

            let frameDelta = 2 * Math.PI * (this.frameCount % this.totalFrames) / this.totalFrames;

            let bg = s.color(this.backgroundColor);
            s.background(bg);

            let xStart = this.width / 6;
            let yStart = this.width / 6;
            let w = xStart + (this.width / 1.5);
            let h = yStart + (this.width / 1.5);

            let yDistance = 5 - Math.abs(Math.cos(frameDelta) * 5);
            yDistance = Math.max(0.5, yDistance);

            for (let y = yStart; y < h; y+= yDistance) {

                s.beginShape();

                let pct = y / h;

                let colorA = s.color(this.colors[0]);
                let colorB = s.color(this.colors[2]);
                let color = s.lerpColor(colorA, colorB, pct);

                s.noFill();
                s.strokeWeight(2);
                s.stroke(color);

                for (let x = xStart; x < w; x++) {
                    let _x = x;

                    let noiseOffset = frameDelta;
                    let offsetY = s.noise(x * 0.01, -noiseOffset + y * 0.01) * 2.5;
                    offsetY = Math.pow(offsetY, 7);

                    let _y = y - Math.abs(Math.sin(frameDelta) * offsetY);
                    //_y = Math.min(_y, y);
                    s.vertex(_x, _y);
                }

                s.endShape();
            }

            if (this.recording) {
                if (frameDelta == 0) {
                    this.completeCallback();
                }
            }
        }
    }

    protected getPolar = function(x, y, r, a) {
        // Get as radians
        var fa = a * (Math.PI / 180);
        
        // Convert coordinates
        var dx = r * Math.cos(fa);
        var dy = r * Math.sin(fa);
        
        // Add origin values (not necessary)
        var fx = x + dx;
        var fy = y + dy;
    
        return [fx, fy];
    }
    

    public render() {

    }

    public play() {
        this.frameCount = 0;
        this.recording = true;
        this.animating = true;
        let bg = this.s.color(this.backgroundColor);
        this.s.background(bg);
    }

    public stop() {
        this.animating = false;
    }

    public setCompleteCallback(completeCallback: any) {
        this.completeCallback = completeCallback;
    }

    public resize() {
        this.s.resizeCanvas(window.innerWidth, window.innerHeight);
        this.s.background(0, 0, 0, 255);
    }
}