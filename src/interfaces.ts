export interface INewBook {
  title: string;
  description: string;
  numberOfPages: number;
  language: string;
  imageUrl: string;
  buyUrl: String;
}
export interface IBook extends INewBook {
  _id: String;
  languageText: string;
}
