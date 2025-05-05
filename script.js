const apiKey = "5dfb81f8d140e9a557fd4d5e0bf11e7c";
const uploadArea = document.getElementById("upload-area");
const fileInput = document.getElementById("file-input");
const previewContainer = document.getElementById("preview-container");
const progressContainer = document.getElementById("progress-container");
const historyList = document.getElementById("history-list");

uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadArea.classList.add("dragover");
});

uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("dragover");
});

uploadArea.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadArea.classList.remove("dragover");
  const files = e.dataTransfer.files;
  handleFiles(files);
});

fileInput.addEventListener("change", () => {
  const files = fileInput.files;
  handleFiles(files);
});

function handleFiles(files) {
  [...files].forEach((file) => {
    previewImage(file);
    uploadImage(file);
  });
}

function previewImage(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const img = document.createElement("img");
    img.src = reader.result;
    img.classList.add("preview-image");
    previewContainer.appendChild(img);
  };
  reader.readAsDataURL(file);
}

function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const progressBar = document.createElement("div");
  progressBar.classList.add("progress-bar");
  const progressFill = document.createElement("div");
  progressFill.classList.add("progress-bar-fill");
  progressBar.appendChild(progressFill);
  progressContainer.appendChild(progressBar);

  fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const link = document.createElement("a");
        link.href = data.data.url;
        link.textContent = data.data.url;
        link.target = "_blank";
        const listItem = document.createElement("li");
        listItem.appendChild(link);
        historyList.appendChild(listItem);
      } else {
        alert("Upload failed.");
      }
    })
    .catch((error) => {
      console.error("Error uploading image:", error);
      alert("An error occurred during upload.");
    })
    .finally(() => {
      progressFill.style.width = "100%";
    });
}
