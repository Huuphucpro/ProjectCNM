import jwt from 'jsonwebtoken'

export const generateToken = (user) => {
  const accessToken = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      phone: user.phone,
      password: user.password,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );

  const refeshToken = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      phone: user.phone,
      password: user.password,
    },
    process.env.REFESH_TOKEN_SECRET,
    {
      expiresIn: "1days",
    }
  );
    console.log({accessToken, accessToken})
  return {
    accessToken,
    refeshToken,
  };
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  
  if (!authorization) {
    console.error("No authorization header provided");
    return res.status(401).send({ message: "Authorization token is required" });
  }

  try {
    let token = authorization;
    
    // Handle Bearer token format
    if (authorization.startsWith('Bearer ')) {
      token = authorization.slice(7);
    } else if (authorization.startsWith('"') && authorization.endsWith('"')) {
      // Handle quoted token format
      token = authorization.slice(1, authorization.length - 1);
    }
    
    console.log("Token for verification:", token.substring(0, 15) + "..." + (token.length > 30 ? token.substring(token.length - 5) : ""));
    
    // Verify the token
    jwt.verify(
      token,
      process.env.TOKEN_SECRET,
      (err, decode) => {
        if (err) {
          console.error("Token verification error:", err.message);
          if (err.name === 'TokenExpiredError') {
            return res.status(401).send({ message: "Token expired, please login again" });
          }
          return res.status(401).send({ message: "Invalid token" });
        } else {
          req.user = decode;
          if (decode && decode._id) {
            console.log("Authenticated user ID:", decode._id);
          }
          next();
        }
      }
    );
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).send({ message: "Authentication error" });
  }
};

export const checkRefeshToken = (token) => {
  
  if (token) {
    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decode) => {
        if (err) {
          res.status(400).send({ message: "invalid token" });
        } else {
          
        }
      }
    );
  } else {
    res.status(401).send({ message: "no token" });
  }
};

