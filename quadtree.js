class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(point) {
        return (point.x >= this.x &&
                point.x < this.x + this.w &&
                point.y >= this.y &&
                point.y < this.y + this.h);
    }

    intersects(rect) {
        if (rect.x > this.x + this.w ||
            rect.x + rect.w < this.x ||
            rect.y > this.y + this.h ||
            rect.y + rect.h < this.y) {
            return false;
        }
        return true;
    }
}

class QuadTree {
    constructor(boundary, capacity) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.items = [];
        this.isDivided = false;
    }

    insert(item) {
        if (!this.boundary.contains(item.position)) {
            return false;
        }
        if (this.items.length < this.capacity) {
            this.items.push(item);
            return true;
        }
        if (!this.isDivided) {
            this.subdivide();
        }
        if (this.northeast.insert(item)) return;
        if (this.northwest.insert(item)) return;
        if (this.southeast.insert(item)) return;
        if (this.southwest.insert(item)) return;
    }

    subdivide() {
        this.isDivided = true;
        this.northwest = new QuadTree(new Rectangle(
            this.boundary.x, this.boundary.y,
            this.boundary.w / 2, this.boundary.h / 2), this.capacity);
        this.northeast = new QuadTree(new Rectangle(
            this.boundary.x + this.boundary.w / 2, this.boundary.y,
            this.boundary.w / 2, this.boundary.h / 2), this.capacity);
        this.southwest = new QuadTree(new Rectangle(
            this.boundary.x, this.boundary.y + this.boundary.h / 2,
            this.boundary.w / 2, this.boundary.h / 2), this.capacity);
        this.southeast = new QuadTree(new Rectangle(
            this.boundary.x + this.boundary.w / 2, this.boundary.y + this.boundary.h / 2,
            this.boundary.w / 2, this.boundary.h / 2), this.capacity);
    }

    show() {
        stroke(0);
        noFill();
        rect(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h);
        if (this.isDivided) {
            this.northwest.show();
            this.northeast.show();
            this.southwest.show();
            this.southeast.show();
        }
    }

    query(rect) {
        let result = [];
        this._queryRecursive(rect, result);
        return result;
    }

    _queryRecursive(rect, result) {
        if (!this.boundary.intersects(rect)) {
            return;
        }
        else {
            for (let item of this.items) {
                if (rect.contains(item.position))
                    result.push(item);
            }
            if (this.isDivided) {
                this.northwest._queryRecursive(rect, result);
                this.northeast._queryRecursive(rect, result);
                this.southwest._queryRecursive(rect, result);
                this.southeast._queryRecursive(rect, result);
            }
        }
    }
}
