document.addEventListener('DOMContentLoaded', () => {
  console.log('Page loaded, JavaScript is running!');

  let isLoading = false;
  let after = '';
  const limit = 5;
  const testimonialContainer = document.getElementById('testimonial-container');

  const fetchTestimonials = async () => {
    if (isLoading) return;
    isLoading = true;

    try {
      const url = `https://corsproxy.io/?https://api.frontendexpert.io/api/fe/testimonials?limit=${limit}&after=${after}`;
      const response = await fetch(url);
      const data = await response.json();

      data.testimonials.forEach((testimonial) => {
        const testimonialDiv = document.createElement('div');
        testimonialDiv.classList.add('testimonial');
        testimonialDiv.innerText = testimonial.message;
        testimonialContainer.appendChild(testimonialDiv);
      });

      if (data.testimonials.length > 0) {
        after = data.testimonials[data.testimonials.length - 1].id;
      }

      if (!data.hasNext) {
        window.removeEventListener('scroll', handleScroll);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      isLoading = false;
    }
  };

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = testimonialContainer;

    if (scrollHeight - scrollTop - clientHeight <= 50 && !isLoading) {
      fetchTestimonials();
    }
  };

  fetchTestimonials();
  testimonialContainer.addEventListener('scroll', handleScroll);
});
