import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Heart } from "lucide-react";

export const HeroSection = ({ slides = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Ensure currentSlide is within bounds
  useEffect(() => {
    if (slides.length > 0 && currentSlide >= slides.length) {
      setCurrentSlide(0);
    }
  }, [slides.length, currentSlide]);

  useEffect(() => {
    if (slides.length === 0) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [currentSlide, slides.length]);

  const nextSlide = () => {
    if (isTransitioning || slides.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning || slides.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide || slides.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Show fallback UI if no slides
  if (!slides || slides.length === 0) {
    return (
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden mb-12 w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 to-neutral-800" />
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Welcome to VLMS
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6 max-w-lg">
                Discover amazing movies and content from around the world
              </p>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-3 bg-white text-black font-semibold px-8 py-3 rounded-lg hover:bg-white/90 transition-colors">
                  <Play className="w-5 h-5" />
                  Explore Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Get current slide with safety checks
  const currentSlideData = slides[currentSlide];
  if (!currentSlideData) {
    return null;
  }

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden mb-12 w-full">
      {/* Background Image */}
      <div 
        key={currentSlide}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-out"
        style={{
          backgroundImage: currentSlideData.image 
            ? `linear-gradient(to right, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.8) 100%), url(${currentSlideData.image})`
            : 'linear-gradient(to right, rgba(30, 30, 30, 1) 0%, rgba(60, 60, 60, 1) 50%, rgba(30, 30, 30, 1) 100%)'
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl">
            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              {currentSlideData.title || 'Featured Movie'}
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-lg">
              {currentSlideData.subtitle || currentSlideData.description || 'Discover amazing content'}
            </p>
            
            {/* Movie Info */}
            <div className="flex items-center gap-6 mb-8 text-white/80">
              {currentSlideData.rating && currentSlideData.rating !== 'N/A' && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">⭐ {currentSlideData.rating}</span>
                </div>
              )}
              {currentSlideData.year && currentSlideData.year !== 'N/A' && (
                <div className="flex items-center gap-2">
                  <span>{currentSlideData.year}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span>Movie</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-3 bg-white text-black font-semibold px-8 py-3 rounded-lg hover:bg-white/90 transition-colors">
                <Play className="w-5 h-5" />
                Watch Now
              </button>
              <button className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/20 transition-colors">
                <Heart className="w-5 h-5" />
                Add to List
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
      
      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white scale-125"
                  : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {/* Progress Bar */}
      {slides.length > 1 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black/30 z-20">
          <div 
            className="h-full bg-white transition-all duration-1000 ease-linear"
            style={{
              width: `${((currentSlide + 1) / slides.length) * 100}%`
            }}
          />
        </div>
      )}
    </section>
  );
};