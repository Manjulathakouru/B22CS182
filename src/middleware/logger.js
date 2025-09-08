
export const logger = (action, data = {}) => {
  try {
    const raw = localStorage.getItem("urlLogs");
    const logs = raw ? JSON.parse(raw) : [];
    logs.unshift({
      time: new Date().toISOString(),
      action,
      data,
    });
    
    if (logs.length > 200) logs.length = 200;
    localStorage.setItem("urlLogs", JSON.stringify(logs));
  } catch (err) {
    
  }
};

export const readLogs = () => {
  try {
    return JSON.parse(localStorage.getItem("urlLogs") || "[]");
  } catch (e) {
    return [];
  }
};
