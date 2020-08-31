/*MOVIE MODEL*/

//export class for movie model
export class Movie {
  //constructor for class
  constructor(
    public _id: string,
    public name: string,
    public genre: string,
    public year: number,
    public duration: string,
    public image: string,
    public rating: number,
    public owner: string
  ) { }
}
