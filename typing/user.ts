export type UserType = {
  user: {
    _id: {};
    info: {
      firstName: string;
      lastName: string;
      telephone: string;
    };
    email: string;
    password: string;
    tokens: [
      {
        token: string;
      }
    ];
    avatar: {
      date: string;
      data: Buffer;
      description: string;
    };
    favorites: string[];
    firstVessel: boolean;
    save: () => void;
  };
};
