variable "prefix" {
  description = "Name prefix for resources"
  type        = string
  default     = "capstone"
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "eastus"
}

variable "node_count" {
  type    = number
  default = 2
}

variable "node_size" {
  type    = string
  default = "Standard_B4ms"
}
