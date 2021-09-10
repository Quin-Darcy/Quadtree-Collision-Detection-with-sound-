class QTree {
    constructor(x, y, w, h, depth, p_points) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.depth = depth;
        this.points = [];
        this.p_points = p_points;
        this.capacity = CAPACITY;
        this.divided = false;

        this.q1 = 0;
        this.q2 = 0;
        this.q3 = 0;
        this.q4 = 0;
    }
    subdivide() {
        if (this.depth < MAX_DEPTH) {
            if (!this.divided) {
                this.fork();
            } else {
                this.q1.subdivide();
                this.q2.subdivide();
                this.q3.subdivide();
                this.q4.subdivide();
            }
        }
    }
    fork() {
        let l = this.points.length;
        this.q1 = new QTree(this.x+this.w/2, this.y, this.w/2, this.h/2, this.depth+1, this.points);
        this.q2 = new QTree(this.x, this.y, this.w/2, this.h/2, this.depth+1, this.points);
        this.q3 = new QTree(this.x, this.y+this.h/2, this.w/2, this.h/2, this.depth+1, this.points);
        this.q4 = new QTree(this.x+this.w/2, this.y+this.h/2, this.w/2, this.h/2, this.depth+1, this.points);
        this.divided = true;
    }
    contains(point) {
        let count = 0;
        if (this.x <= point.x && point.x <= this.x+this.w) {
            count += 1;
        }
        if (this.y <= point.y && point.y <= this.y+this.h) {
            count += 1;
        }
        if (count === 2) {
            return true;
        } else {
            return false;
        }
    }
    propogate() {
        this.points = [];
        for (let i = 0; i < this.p_points.length; i++) {
            if (this.contains(this.p_points[i])) {
                this.points.push(this.p_points[i]);
            }
        }
        this.p_points = [];
        this.p_points.length = 0;
    }
    insert(point) {
        if (this.contains(point)) {
            if (this.points.length < this.capacity) {
                this.points.push(point);
            } else {
                if (!this.divided && this.depth < MAX_DEPTH) {
                    this.subdivide();
                    this.points = [];
                    this.q1.propogate();
                    this.q2.propogate();
                    this.q3.propogate();
                    this.q4.propogate();
                }
                if (this.divided) {
                    this.q1.insert(point);
                    this.q2.insert(point);
                    this.q3.insert(point);
                    this.q4.insert(point);
                }
            }
        } 
    }
    check_col() {
        if (!this.divided) {
            for (let i = 0;  i < this.points.length; i++) {
                for (let j = 0; j < this.points.length; j++) {
                    let a = this.points[i];
                    let b = this.points[j];
                    if (a.x != b.x && a.y != b.y && a.id != b.id) {
                        let d = dist(a.x, a.y, b.x, b.y);
                        if (d < a.r) {
                            this.points[i].contact = true;
                            this.points[i].coll(this.points[j]);
                            this.points[i].sound();
                            
                        } else {
                            this.points[i].contact = false;
                        }
                    }
                }
            }
        } else {
            this.q1.check_col();
            this.q2.check_col();
            this.q3.check_col();
            this.q4.check_col();
        }
    }
    show() {
        if (TREE === 1) {
            colorMode(HSB, MAX_DEPTH, 1, 1);
            rectMode(CORNER);
            noFill();

            let s_weight = 2 / (this.depth+1);
            if (this.depth < MAX_DEPTH) {
                stroke(this.depth, 1, 1);
            } else if (this.depth === MAX_DEPTH) {
                stroke(5*this.depth/6, 1, 1);
            } else {
                stroke(MAX_DEPTH-this.depth, 1, 1);
            }

            strokeWeight(s_weight);
            rect(this.x, this.y, this.w-s_weight, this.h-s_weight);

            if (this.q1 != 0) {
                this.q1.show();
                this.q2.show();
                this.q3.show();
                this.q4.show();
            }
        }
    }
}








































/*class QTree {
    constructor(x, y, w, h, depth) {
        // class variables to define rect
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        // children of current quadrant
        this.q1 = 0;
        this.q2 = 0;
        this.q3 = 0;
        this.q4 = 0;
        // node distance from root quadrant
        this.depth = depth;
        // flag for particle containment used in show()
        this.contains = false;

        this.arr = [];
    }
    print_arr() {
        console.log(this.depth, this.arr.length);
        if (this.q1 != 0) {
            this.q1.print_arr();
            this.q2.print_arr();
            this.q3.print_arr();
            this.q4.print_arr();
        }
    }
    find_particle() {
        let count = 0;

        if (this.x <= P.x && P.x < this.x+this.w) {
            count += 1;
        }
        if (this.y <= P.y && P.y < this.y+this.h) {
            count += 1;
        }
        if (count === 2) {
            this.arr.push(P);
            if (this.arr.length >= 2) {
                this.contains = true;
                this.subdivide();
            }
            else {
                this.remove_subtree();
            }
        } else {
            this.remove_subtree();
            let index = 0;
            for (let i = 0; i < this.arr.length; i++) {
                if (this.arr[i].x === P.x && this.arr[i].y === P.y) {
                    this.arr.splice(index, 1);
                    i -= 1;
                }
            }
            this.arr.splice(index, 1);
            this.contains = false;
        }

        if (this.q1 != 0) {
            this.q1.find_particle();
            this.q2.find_particle();
            this.q3.find_particle();
            this.q4.find_particle();
        }
    }
    subdivide() {
        if (this.depth < MAX_DEPTH) {
            if (this.q1 === 0) {
                this.fork();
            } else {
                this.q1.subdivide();
                this.q2.subdivide();
                this.q3.subdivide();
                this.q4.subdivide();
            }
        }
    }
    fork() {
        this.q1 = new QTree(this.x+this.w/2, this.y, this.w/2, this.h/2, this.depth+1);
        this.q2 = new QTree(this.x, this.y, this.w/2, this.h/2, this.depth+1);
        this.q3 = new QTree(this.x, this.y+this.h/2, this.w/2, this.h/2, this.depth+1);
        this.q4 = new QTree(this.x+this.w/2, this.y+this.h/2, this.w/2, this.h/2, this.depth+1);
    }
    remove_subtree() {
        if (this.depth > 0) {
            if (this.q1 != 0) {
                this.q1 = 0;
                this.q2 = 0;
                this.q3 = 0;
                this.q4 = 0;
            }
        }
    }
    show() {
        colorMode(HSB, MAX_DEPTH, 1, 1);
        rectMode(CORNER);
        noFill();

        let s_weight = 2 / (this.depth+1);
        if (this.contains && this.depth < MAX_DEPTH) {
            stroke(this.depth, 1, 1);
        } else if (this.contains && this.depth === MAX_DEPTH) {
            fill(5*this.depth/6, 1, 1);
        } else {
            stroke(MAX_DEPTH-this.depth, 1, 1);
        }

        strokeWeight(s_weight);
        rect(this.x, this.y, this.w-s_weight, this.h-s_weight);

        if (this.q1 != 0) {
            this.q1.show();
            this.q2.show();
            this.q3.show();
            this.q4.show();
        }
    }
}*/