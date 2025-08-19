# Use a lightweight Nginx image
FROM nginx:alpine

# Copy the HTML file into the Nginx web directory
COPY index.html /usr/share/nginx/html/index.html

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80, the default for Nginx
EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]