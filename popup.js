document.addEventListener('DOMContentLoaded', function() {
    var paramsTextarea = document.getElementById('params');
    var saveButton = document.getElementById('save');
  
    const storage = chrome.storage.sync;
  

    storage.get("params", function(data) {
      if (chrome.runtime.lastError) {
        console.error("Error retrieving params:", chrome.runtime.lastError);
        return;
      }
      if (data.params) {
        paramsTextarea.value = data.params;
        console.log("Loaded params:", data.params);
      } else {
        console.log("No params found in storage.");
      }
    });

    saveButton.addEventListener('click', function() {
      var newParams = paramsTextarea.value;
      storage.set({ params: newParams }, function() {
        if (chrome.runtime.lastError) {
          console.error("Error saving params:", chrome.runtime.lastError);
          alert("Error saving parameters: " + chrome.runtime.lastError.message);
        } else {
          console.log("Parameters saved:", newParams);
          alert("Parameters saved!");
        }
      });
    });
  });
  