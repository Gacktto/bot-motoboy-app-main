"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Pencil, Trash2, Search, User, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import Cookies from 'js-cookie'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { useEnterpriseContacts } from "@/hooks/useEnterpriseContacts"
import { usePostEnterpriseContact } from "@/hooks/usePostEnterpriseContacts"
import { useDeleteEnterpriseContacts } from "@/hooks/useDeleteEnterpriseContacts";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { contactSchema, type ContactFormValues } from "@/lib/validations/contact"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface Contact {
  id: string
  name: string
  phone: string
}

export default function ContatosPage() {
  const { contact, isLoading, isError } = useEnterpriseContacts();
  const { mutate } = usePostEnterpriseContact();
  const { mutate: deleteContactMutate } = useDeleteEnterpriseContacts();
  console.log(contact);
  const [searchTerm, setSearchTerm] = useState("")
  const [contacts, setContacts] = useState<Contact[]>([])
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null)
  const [confirmDelete, setConfirmDelete] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    if(!isLoading && contact) {
      const userId = Cookies.get("user_id");

      const filteredContacts = contact.filter((c: any) => c.userId === userId);

      setContacts(filteredContacts);
    }
  }, [isLoading, isError, contact])

  const addForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  })

  const editForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  })

  const filteredContacts = contacts.filter(
    (contact) => contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || contact.phone.includes(searchTerm),
  )

  const handleAddContact = (values: ContactFormValues) => {
    const id = (contacts.length + 1).toString()
    setContacts([...contacts, { id, ...values }])
    addForm.reset()
  }

  const handleEditContact = (values: ContactFormValues) => {
    if (editingContact) {
      setContacts(contacts.map((contact) => (contact.id === editingContact.id ? { ...contact, ...values } : contact)))
      setEditingContact(null)
    }
  }

  const handleDeleteContact = () => {
    if (deletingContact && confirmDelete === deletingContact.phone) {
      deleteContactMutate(
        { contactId: deletingContact.id },
        {
          onSuccess: () => {
            setContacts((prev) => prev.filter((c) => c.id !== deletingContact.id));
            setDeletingContact(null);
            setConfirmDelete("");
            setShowDeleteDialog(false);
  
            toast({
              title: "Contato excluído",
              description: "O contato foi excluído com sucesso.",
            });
          },
          onError: () => {
            toast({
              title: "Erro",
              description: "Erro ao excluir o contato. Tente novamente.",
              variant: "destructive",
            });
          }
        }
      );
    }
  };
  

  function handleAddContacts(name: string, phone: string) {
    mutate(
      { name: name, phone: phone },
      {
        onSuccess: (data) => {
          console.log('Contato criado com sucesso!');
          const userId = Cookies.get("user_id");
  
          setContacts((prev) => [...prev, {
            id: data.id, // Se o backend retornar o ID novo
            name,
            phone,
            userId,
          }]);
          addForm.reset();
        },
        onError: () => {
          console.log('Erro ao criar contato.');
        }
      }
    );
  }
  

  const formatPhoneNumber = (value: string) => {
    let phone = value.replace(/\D/g, "")

    if (phone.length <= 11) {
      // Format as (XX) XXXXX-XXXX
      if (phone.length > 2) {
        phone = `(${phone.substring(0, 2)}) ${phone.substring(2)}`
      }
      if (phone.length > 10) {
        phone = `${phone.substring(0, 10)}-${phone.substring(10)}`
      }

      return phone
    }

    return value
  }

  const startEditing = (contact: Contact) => {
    setEditingContact(contact)
    editForm.reset({
      name: contact.name,
      phone: contact.phone,
    })
  }

  const openDeleteDialog = (contact: Contact) => {
    setDeletingContact(contact)
    setConfirmDelete("")
    setShowDeleteDialog(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Contatos</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Contato
            </Button>
          </DialogTrigger>
          <DialogContent >
            <DialogHeader>
              <DialogTitle>Adicionar Contato</DialogTitle>
              <DialogDescription>Adicione um novo contato à sua lista.</DialogDescription>
            </DialogHeader>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit((data) => handleAddContacts(data.name, data.phone))} className="grid gap-4 py-4">
                <div className="space-y-2">
                  <FormField
                    control={addForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <User className="h-4 w-4 text-gray-400" />
                            </div>
                            <Input placeholder="Nome completo" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField
                    control={addForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Phone className="h-4 w-4 text-gray-400" />
                            </div>
                            <Input
                              placeholder="(00) 00000-0000"
                              className="pl-10"
                              {...field}
                              onChange={(e) => {
                                field.onChange(formatPhoneNumber(e.target.value))
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      type="submit"
                      disabled={!addForm.formState.isValid}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Adicionar
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Contatos</CardTitle>
          <CardDescription>Visualize, adicione, edite ou remova contatos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar contatos..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredContacts.length > 0 ? (
                      filteredContacts.map((contact, index) => (
                        <motion.tr
                          key={contact.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b transition-colors hover:bg-gray-50"
                        >
                          <TableCell className="font-medium">{contact.name}</TableCell>
                          <TableCell>{contact.phone}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => startEditing(contact)}>
                                    <Pencil className="h-4 w-4 text-gray-500" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Editar Contato</DialogTitle>
                                    <DialogDescription>Edite as informações do contato.</DialogDescription>
                                  </DialogHeader>
                                  {editingContact && (
                                    <Form {...editForm}>
                                      <form
                                        onSubmit={editForm.handleSubmit(handleEditContact)}
                                        className="grid gap-4 py-4"
                                      >
                                        <div className="space-y-2">
                                          <FormField
                                            control={editForm.control}
                                            name="name"
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel>Nome</FormLabel>
                                                <FormControl>
                                                  <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                      <User className="h-4 w-4 text-gray-400" />
                                                    </div>
                                                    <Input placeholder="Nome completo" className="pl-10" {...field} />
                                                  </div>
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <FormField
                                            control={editForm.control}
                                            name="phone"
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel>Telefone</FormLabel>
                                                <FormControl>
                                                  <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                      <Phone className="h-4 w-4 text-gray-400" />
                                                    </div>
                                                    <Input
                                                      placeholder="(00) 00000-0000"
                                                      className="pl-10"
                                                      {...field}
                                                      onChange={(e) => {
                                                        field.onChange(formatPhoneNumber(e.target.value))
                                                      }}
                                                    />
                                                  </div>
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                        </div>
                                        <DialogFooter>
                                          <DialogClose asChild>
                                            <Button variant="outline">Cancelar</Button>
                                          </DialogClose>
                                          <Button
                                            type="submit"
                                            disabled={!editForm.formState.isValid}
                                            className="bg-emerald-600 hover:bg-emerald-700"
                                          >
                                            Salvar
                                          </Button>
                                        </DialogFooter>
                                      </form>
                                    </Form>
                                  )}
                                </DialogContent>
                              </Dialog>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500"
                                onClick={() => openDeleteDialog(contact)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">
                          Nenhum contato encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Contato</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este contato? Esta ação não pode ser desfeita. Digite o número do telefone
              para confirmar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              placeholder={`Digite ${deletingContact?.phone} para confirmar`}
              value={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmDelete("")}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteContact}
              disabled={confirmDelete !== deletingContact?.phone}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

