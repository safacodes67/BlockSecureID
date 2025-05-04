
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, MessageSquare } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const supportTeam = [
  {
    name: "Vinutha",
    phone: "7676890636",
    email: "vinuthah355@gmail.com",
  },
  {
    name: "Sumayya Fatima",
    phone: "9380086453",
    email: "sumayyaf166@gmail.com",
  },
  {
    name: "Chandana",
    phone: "7348961739",
    email: "reddychandhana974@gmail.com",
  },
];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

const Contact = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real application, this would send the data to a backend
    console.log(values);
    
    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });
    
    form.reset();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <p className="text-muted-foreground mt-2">
          Have questions? Reach out to our support team for assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {supportTeam.map((member) => (
          <Card key={member.email} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">{member.name}</CardTitle>
              <CardDescription>Support Team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{member.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">
                  {member.email}
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="lg:sticky lg:top-8">
          <CardHeader>
            <CardTitle>Send Us a Message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <div className="bg-muted flex items-center justify-center p-2 rounded-l-md">
                            <User className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <Input className="rounded-l-none" placeholder="Your name" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <div className="bg-muted flex items-center justify-center p-2 rounded-l-md">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <Input className="rounded-l-none" placeholder="your.email@example.com" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <div className="bg-muted flex items-center justify-center p-2 rounded-l-md">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <Input className="rounded-l-none" placeholder="Your phone number" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <div>
                          <div className="flex">
                            <div className="bg-muted flex items-center justify-center p-2 rounded-l-md h-24">
                              <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <Textarea 
                              className="rounded-l-none min-h-24" 
                              placeholder="How can we help you?" 
                              {...field} 
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Us</CardTitle>
            </CardHeader>
            <CardContent className="prose">
              <p>BlockSecure ID is a blockchain-based identity management platform that helps individuals and financial institutions secure their digital identity.</p>
              <p>Our mission is to provide a secure, decentralized solution for identity verification, consent management, and fraud prevention using cutting-edge blockchain technology.</p>
              <p>The platform was developed by a team of blockchain enthusiasts and security experts with a vision to make digital identity management more secure and user-centric.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              <div className="py-3">
                <h3 className="font-medium mb-1">How secure is my data?</h3>
                <p className="text-sm text-muted-foreground">
                  Your data is secured with blockchain technology and encrypted storage. Only you control who can access your information.
                </p>
              </div>
              <div className="py-3">
                <h3 className="font-medium mb-1">What happens if I forget my recovery phrase?</h3>
                <p className="text-sm text-muted-foreground">
                  If you've enabled facial recognition recovery, you can use that method to regain access. Otherwise, please contact our support team for assistance.
                </p>
              </div>
              <div className="py-3">
                <h3 className="font-medium mb-1">Is BlockSecure ID compatible with all wallet providers?</h3>
                <p className="text-sm text-muted-foreground">
                  Currently, we support MetaMask wallet integration. Additional wallet providers will be supported in future updates.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
