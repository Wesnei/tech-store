export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const authStorage = localStorage.getItem('auth-storage');
    console.log("🔍 Auth storage raw value:", authStorage); 
    
    if (authStorage) {
      const authData = JSON.parse(authStorage);
      console.log("🔍 Auth data parsed:", authData);      
      let token = null;
      
      if (authData?.state?.user?.token) {
        token = authData.state.user.token;
      }
      else if (authData?.user?.token) {
        token = authData.user.token;
      }
      else {
        const searchForToken = (obj: any): string | null => {
          if (!obj || typeof obj !== 'object') return null;
          
          for (const key in obj) {
            if (typeof obj[key] === 'string' && obj[key].startsWith('eyJ')) {
              return obj[key];
            } else if (typeof obj[key] === 'object') {
              const found = searchForToken(obj[key]);
              if (found) return found;
            }
          }
          return null;
        };
        
        token = searchForToken(authData);
      }
      
      console.log("🔍 Extracted token:", token ? `${token.substring(0, 20)}...` : "None"); 
      
      if (token && typeof token === 'string' && token.startsWith('eyJ')) {
        return token;
      } else {
        console.log("⚠️ Token validation failed - not a valid JWT token");
      }
    } else {
      console.log("⚠️ No auth-storage found in localStorage");
    }
  } catch (e) {
    console.warn('Failed to parse auth storage', e);
  }

  try {
    const directToken = localStorage.getItem('token');
    if (directToken && directToken.startsWith('eyJ')) {
      console.log("🔍 Found direct token in localStorage:", directToken.substring(0, 20) + "...");
      return directToken;
    }
  } catch (e) {
    console.warn('Failed to get direct token from localStorage', e);
  }

  console.log("🔍 Returning null token");
  return null;
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;
  
  if (token.split('.').length !== 3) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp) {
      const expDate = new Date(payload.exp * 1000);
      const now = new Date();
      return expDate > now;
    }
    return true;
  } catch (e) {
    return false;
  }
};

export const isUserAdmin = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;
  
  if (token.split('.').length !== 3) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    if (payload.role && payload.role.toLowerCase() === 'admin') {
      return true;
    }
    
    if (payload.roles && Array.isArray(payload.roles) && payload.roles.includes('admin')) {
      return true;
    }
    
    if (payload.isAdmin === true) {
      return true;
    }
    
    if (payload.admin === true) {
      return true;
    }
    
    return false;
  } catch (e) {
    console.warn('Failed to decode JWT token for role checking', e);
    return false;
  }
};

export const clearAuthData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth-storage');
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp) {
      const expDate = new Date(payload.exp * 1000);
      const now = new Date();
      return expDate <= now;
    }
    return false;
  } catch (e) {
    return true;
  }
};