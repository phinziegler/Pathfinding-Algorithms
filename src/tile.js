export { Tile };
class Tile {
    constructor(size, coordinate) {
        this.size = size;
        this.coordinate = coordinate;
    }

    // draw(ctx, offset) {
    //     const X = this.coordinate.getX();
    //     const Y = this.coordinate.getY();

    //     let ul = new Coordinate(X * this.size, Y * this.size);                                      // upper left
    //     let ur = new Coordinate((X * this.size) + this.size, Y * this.size);                        // uppder right
    //     let dl = new Coordinate(X * this.size, (Y * this.size) + this.size);                        // down left
    //     let dr = new Coordinate((X * this.size) + this.size, (Y * this.size) + this.size);          // down right

    //     ctx.fillStyle = "black";
    //     ctx.fillRect(ul.getX(), ul.getY(), this.size, this.size);
    //     ctx.fillStyle = "white";
    //     const offset = this.size / 5;
    //     ctx.fillRect(ul.getX() + offset, ul.getY() + offset, this.size - (offset), this.size - (offset));
    // }
}