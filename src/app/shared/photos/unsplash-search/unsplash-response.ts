export class UnsplashResponse {
  results: UnsplashPhoto[];
  total: number;
  total_pages: number;
}

// UNSPLASH response types - UnsplashRes is root, UnsplashPhotos above is the simple version

export interface UnsplashPhoto {
  id: string;
  created_at: Date;
  updated_at: Date;
  promoted_at?: Date;
  width: number;
  height: number;
  color: string;
  description: string;
  alt_description: string;
  urls: Urls;
  links: PhotoLinks;
  categories: any[];
  likes: number;
  liked_by_user: boolean;
  current_user_collections: any[];
  sponsorship?: any;
  user: User;
  tags: Tag[];
}

export interface User {
  id: string;
  updated_at: Date;
  username: string;
  name: string;
  first_name: string;
  last_name: string;
  twitter_username: string;
  portfolio_url: string;
  bio: string;
  location: string;
  links: UserLinks;
  profile_image: ProfileImage;
  instagram_username: string;
  total_collections: number;
  total_likes: number;
  total_photos: number;
  accepted_tos: boolean;
}

export interface ProfileImage {
  small: string;
  medium: string;
  large: string;
}

export interface Urls {
  raw: string;
  full: string;

  /** width 1080 */
  regular: string;
  /** width 400 */
  small: string;
  /** width 200 */
  thumb: string;
}

export interface Tag {
  type: string;
  title: string;
  // source: Source;
}

export interface PhotoLinks {
  self: string;
  html: string;
  download: string;
  download_location: string; // use this one ;)
}

export interface UserLinks {
  self: string;
  html: string;
  photos: string;
  likes: string;
  portfolio: string;
  following: string;
  followers: string;
}

// export interface Source {
//   ancestry: Ancestry;
//   title: string;
//   subtitle: string;
//   description: string;
//   meta_title: string;
//   meta_description: string;
//   cover_photo: CoverPhoto;
// }

// export interface CoverPhoto {
//   id: string;
//   created_at: Date;
//   updated_at: Date;
//   promoted_at?: Date;
//   width: number;
//   height: number;
//   color: string;
//   description: string;
//   alt_description: string;
//   urls: Urls;
//   links: PhotoLinks;
//   categories: any[];
//   likes: number;
//   liked_by_user: boolean;
//   current_user_collections: any[];
//   sponsorship?: any;
//   user: User;
// }

// export interface Ancestry {
//   type: Type;
//   category: Category;
//   subcategory: Subcategory;
// }

// extra

// export interface Type {
//   slug: string;
//   pretty_slug: string;
// }

// export interface Category {
//   slug: string;
//   pretty_slug: string;
// }

// export interface Subcategory {
//   slug: string;
//   pretty_slug: string;
// }

// export interface UnsplashPhoto {
//   // user
//   name: string;
//   location: string;

//   // photo
//   thumbUrl: string;
//   description: string;
//   updated_at: string;
// }

// private mapPhoto(data: any): UnsplashPhoto {
//   return {
//     name: data.user.name,
//     location: data.user.location || 'Earth',
//     thumbUrl: data.urls.thumb,
//     description: data.description,
//     updated_at: data.updated_at
//   };
// }

// return photos.sort((previous: UnsplashPhoto, next: UnsplashPhoto) => {
//   const previousName = previous.name.toLowerCase();
//   const nextName = next.name.toLowerCase();
//   if (previousName < nextName) {
//     return -1;
//   }
//   if (previousName > nextName) {
//     return 1;
//   }
//   return 0;
// });
