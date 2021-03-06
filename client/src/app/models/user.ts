/*USER MODEL */

//import movie model
import { Movie } from './movie';

//export a class for user model
export class User {
  //constructor for class
  constructor(
    public _id: string,
    public name: string,
    public lastname: string,
    public email: string,
    public password: string,
    public address: string,
    public phone: string,
    public image: string,
  ) { }
}
