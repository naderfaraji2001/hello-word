provider "aws" {
  version = "~> 2.0"
  region  = "us-west-2"
  access_key = "AAAAAAA"
  secret_key = "AAAAAA"
}

# Create a VPC
resource "aws_vpc" "example" {
  cidr_block = "10.2.0.0/16"
}
