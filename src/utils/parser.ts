export const parseToken = (authorization: string) => {
    try {
      if (!authorization) {
        return false;
      }
    
      if (!authorization.startsWith("Bearer ")) {
        return false;
      }
    
      const token = authorization.split(" ")[1];
    
      return token;
    } catch (err) {
      return false;
    }
  };
  