let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  touchEndX = 0;
  touchEndY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Listen for touchmove event
    paper.addEventListener('touchmove', (e) => {
      e.preventDefault(); // Prevent default scrolling behavior

      if (!this.rotating) {
        this.touchMoveX = e.touches[0].clientX;
        this.touchMoveY = e.touches[0].clientY;

        // Calculate velocity for smoother movement
        this.velX = this.touchMoveX - this.prevTouchX;
        this.velY = this.touchMoveY - this.prevTouchY;
      }

      const dirX = e.touches[0].clientX - this.touchStartX;
      const dirY = e.touches[0].clientY - this.touchStartY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;

      // Handle rotation while holding paper
      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevTouchX = this.touchMoveX;
        this.prevTouchY = this.touchMoveY;

        // Apply the movement and rotation via CSS transform
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    });

    // Listen for touchstart event
    paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return;

      this.holdingPaper = true;

      // Set highest z-index for the currently held paper
      paper.style.zIndex = highestZ;
      highestZ += 1;

      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.prevTouchX = this.touchStartX;
      this.prevTouchY = this.touchStartY;
    });

    // Listen for touchend event
    paper.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // For two-finger rotation on touch screens (gesture rotation)
    paper.addEventListener('gesturestart', (e) => {
      e.preventDefault();
      this.rotating = true;
    });

    paper.addEventListener('gestureend', () => {
      this.rotating = false;
    });
  }
}

// Initialize each paper element
const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
