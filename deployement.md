## deployement steps
    -setup aws acc
    -launch ec2 instance
    -chmod 400 "yourpemfile.pem"
    -ssh -i "file.pem" ubuntu@ec2......
    -install node same version
    -git clone projects microservices
    Deploy Frontend
        -npm install -> dependencies installation 
        -npm run build
        -sudo apt update
        -sudo apt install nginx
        -sudo systemctl start nginx
        -sudo systemctl enable nginx
        -sudo scp -r dist/*/var/www/html - copy code from dist(build files) to /var/www/html
        -enable port :80 of your instance 