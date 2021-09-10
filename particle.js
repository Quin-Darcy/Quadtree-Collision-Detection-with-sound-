class Particle {
    constructor(x, y, r, id) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.id = id;

        this.osc = new p5.Oscillator('sine');
        
        this.v_x = 0;
        this.v_y = 0;
        this.cor = 0.91
        this.mu = -0.9
        this.hardness = 0.05;

        this.x_coeff = 0;
        this.y_coeff = 0;

        this.contact = false;
    }
    coll(parr) {
        let dx = parr.x - this.x;
        let dy = parr.y - this.y;
        let center_dist = dist(dx, dy, 0, 0);
        let touching_dist = parr.r + this.r;
        if (center_dist < touching_dist) {
            let theta = atan2(dy, dx);
            let new_x = this.x + cos(theta) * touching_dist;
            let new_y = this.y + sin(theta) * touching_dist;
            let a_x = (new_x - parr.x) * this.cor;
            let a_y = (new_y - parr.y) * this.cor;
            this.v_x -= a_x * this.hardness;
            this.v_y -= a_y * this.hardness;
            parr.v_x += a_x * this.hardness;
            parr.v_y += a_y * this.hardness; 
        }
    }
    sound() {
        let d = 10*Math.sqrt(Math.pow(this.v_x, 2)+Math.pow(this.v_y, 2));
        let f = map(d, 0, 100, 500, 2000);
        let a = map(d, 0, 100, 0, 0.8);
        this.osc.freq(f);
        this.osc.amp(a);
        if (C === 1) {
            this.osc.start();
        }
    }
    no_sound() {
        this.osc.stop()
    }
    show() {
        if (this.contact) {
            stroke(252, 3, 236);
            strokeWeight(2);
            noFill();
            let d = 10*Math.sqrt(Math.pow(this.v_x, 2)+Math.pow(this.v_y, 2));
            circle(this.x, this.y, d);
            noStroke();
            
            this.contact = false;
        } else {
            this.osc.stop();
            noStroke();
            fill(255);
        }
        ellipse(this.x, this.y, this.r);
    }
    update() {
        let X = this.x - W/2 * Math.cos(frameCount / 70 + P) - W/2;
        let Y = this.y - H/2 * Math.sin(frameCount / 70 + P) - H/2;
        this.x_coeff = Math.cos(frameCount / 100 - P);
        this.y_coeff = Math.sin(frameCount / 100 - P);
        let V = createVector(this.x_coeff*(Y-X), this.y_coeff*(-X-Y));
        V.setMag(abs(Math.log(V.mag()+0.1))/200);
        this.v_x += V.x;
        this.v_y += V.y;
    }
    move() {
        this.x += this.v_x;
        this.y += this.v_y;
        
        if (this.x > W-this.r) {
            this.x = W-this.r;
            this.v_x *= this.cor * this.mu;
        } else if (this.x < this.r) {
            this.x = this.r;
            this.v_x *= this.cor * this.mu;
        }
        if (this.y > H-this.r) {
            this.y = H-this.r;
            this.v_y *= this.cor * this.mu;
        } else if (this.y < this.r) {
            this.y = this.r;
            this.v_y *= this.cor * this.mu;
        }
    }
    
}