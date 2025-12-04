# PEN2-Stack Architecture Patterns

This document outlines the code patterns and architectural decisions used in the PEN2-Stack project.

---

## Table of Contents

1. [Backend Architecture](#backend-architecture)
   - [Module Structure](#module-structure)
   - [Dependency Injection](#dependency-injection)
   - [Layer Responsibilities](#layer-responsibilities)
   - [Cross-Module Communication](#cross-module-communication)
2. [Frontend Architecture](#frontend-architecture)
   - [App Router Structure](#app-router-structure)
   - [Module Organization](#module-organization)
   - [Server Actions](#server-actions)
   - [Component Patterns](#component-patterns)
3. [Shared Patterns](#shared-patterns)
   - [Type Definitions](#type-definitions)
   - [Validation with Zod](#validation-with-zod)
   - [Response Format](#response-format)

---

## Backend Architecture

### Module Structure

Each feature in the backend is organized as a **self-contained module** under `src/modules/`. A typical module contains:

```
modules/todo/
├── index.ts           # Composition root (dependency injection)
├── todo.model.ts      # TypeORM entity definition
├── todo.repo.ts       # Repository layer (database operations)
├── todo.services.ts   # Service layer (business logic)
├── todo.controller.ts # Controller layer (HTTP handling)
├── todo.routes.ts     # Route definitions
├── todo.validations.ts# Zod validation schemas
└── todo.d.ts          # Type definitions
```

### Dependency Injection

The project uses **constructor-based dependency injection** for loose coupling and testability.

#### Injection Chain

```
TodoRepository → TodoService → TodoController → TodoRoutes
```

Each layer is injected into the layer above it:

```typescript
// index.ts - The Composition Root
const todoRepository = new TodoRepository();
const todoService = new TodoService(todoRepository);
const todoController = new TodoController(todoService);
const todoRoutesInstance = new TodoRoutes(todoController);

export const todoRoutes = todoRoutesInstance.router;
export { TodoService };
```

#### Benefits

1. **Loose Coupling** - Classes don't know how their dependencies are created
2. **Testability** - Easy to mock dependencies in unit tests
3. **Flexibility** - Can swap implementations without changing class code
4. **Single Responsibility** - Each class focuses on its own logic

### Layer Responsibilities

#### Repository Layer (`*.repo.ts`)

Handles all database operations using TypeORM:

```typescript
export default class TodoRepository {
  private readonly manager = appDataSource.manager;

  public async getAllTodosRepo(): Promise<IDataResponse<ITodo[]>> {
    try {
      const todos = await this.manager.find(Todo);
      return { success: true, data: todos };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    }
  }
}
```

**Rules:**
- Never exposed outside the module
- Returns standardized response objects
- Handles database errors gracefully

#### Service Layer (`*.services.ts`)

Contains business logic and validation:

```typescript
export default class TodoService {
  private readonly todoRepository: TodoRepository;

  constructor(todoRepository: TodoRepository) {
    this.todoRepository = todoRepository;
  }

  public async createTodo(data: ITodoInsertDTO): Promise<IDataResponse<ITodo>> {
    // Validate input
    const validation = createTodoSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, message: getErrorMessage(validation.error) };
    }

    // Call repository
    return this.todoRepository.createTodoRepo(validation.data);
  }
}
```

**Rules:**
- Validates all inputs using Zod schemas
- Contains business rules and logic
- Can be injected into other modules' services

#### Controller Layer (`*.controller.ts`)

Handles HTTP request/response:

```typescript
export default class TodoController {
  private readonly todoService: TodoService;

  constructor(todoService: TodoService) {
    this.todoService = todoService;
  }

  public getAllTodosController = async (req: Request, res: Response) => {
    const result = await this.todoService.getAllTodos();
    res.status(result.success ? 200 : 400).json(result);
  };
}
```

**Rules:**
- Extracts data from requests (params, body, query)
- Calls appropriate service methods
- Sets HTTP status codes and returns JSON

#### Routes Layer (`*.routes.ts`)

Defines API endpoints:

```typescript
export default class TodoRoutes {
  public readonly router: Router;

  constructor(todoController: TodoController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.todoController.getAllTodosController);
    this.router.post('/', this.todoController.createTodoController);
  }
}
```

### Cross-Module Communication

- **Only Services** can be injected into other modules
- Never inject Repository, Controller, or Routes across modules

```typescript
// ✅ Correct: Service to Service
class OrderService {
  constructor(private todoService: TodoService) {}
}

// ❌ Wrong: Repository to Service (different module)
class OrderService {
  constructor(private todoRepository: TodoRepository) {}
}
```

---

## Frontend Architecture

### App Router Structure

Using Next.js 15 App Router with **route groups** for layout organization:

```
app/
├── (main)/           # Main layout group
│   ├── layout.tsx    # Shared header/nav
│   ├── todos/        # Todo feature
│   │   └── page.tsx
│   └── documents/    # Documentation
│       └── page.tsx
├── layout.tsx        # Root layout
└── page.tsx          # Home page
```

### Module Organization

Feature modules under `src/modules/` contain:

```
modules/todos/
├── todo.actions.ts       # Server actions (API calls)
├── todo.const.ts         # Constants (statuses, options)
├── todo-table.tsx        # List view component
├── todo-columns.tsx      # Table column definitions
├── todo-create-sheet.tsx # Create form (sheet panel)
├── todo-edit-sheet.tsx   # Edit form (sheet panel)
├── todo-row-actions.tsx  # Row action menu
└── todo-status-filter.tsx# Filter component
```

### Server Actions

Using Next.js Server Actions for data fetching:

```typescript
'use server';

export async function getTodos(): Promise<IDataResponse<ITodo[]>> {
  const axiosRes = await axiosRequest('GET', `${baseURL}todos/`);
  
  if (!axiosRes.success) {
    return { success: false, message: axiosRes.message };
  }

  return { success: true, data: axiosRes.data };
}

export async function createTodo(data: ITodoInsertDTO) {
  const result = await axiosRequest('POST', baseURL, data);
  
  if (result.success) {
    revalidatePath('/todos'); // Invalidate cache
  }
  
  return result;
}
```

**Key Patterns:**
- Use `'use server'` directive
- Call `revalidatePath()` after mutations
- Return standardized response objects

### Component Patterns

#### Sheets for Forms

Using slide-in sheets for create/edit forms:

```tsx
<Sheet open={open} onOpenChange={onOpenChange}>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Create Todo</SheetTitle>
    </SheetHeader>
    <form>...</form>
  </SheetContent>
</Sheet>
```

#### Data Tables with TanStack Table

```tsx
const columns: ColumnDef<ITodo>[] = [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'status', header: 'Status', cell: StatusCell },
];

<DataTable columns={columns} data={todos} />
```

#### Suspense Boundaries

Using React Suspense for loading states:

```tsx
<Suspense fallback={<TableSkeleton />}>
  <TodoTable data={await getTodos()} />
</Suspense>
```

#### Forms with TanStack Form + Zod

```tsx
const form = useForm({
  defaultValues: { title: '', status: 'pending' },
  validators: { onSubmit: formSchema },
  onSubmit: async ({ value }) => {
    await createTodo(value);
  },
});

<form.Field name="title" children={(field) => (
  <Input
    value={field.state.value}
    onChange={(e) => field.handleChange(e.target.value)}
  />
)} />
```

---

## Shared Patterns

### Type Definitions

Global types in `types/` directory:

```typescript
// Base response types
interface IBasicResponse {
  success: boolean;
  message?: string;
}

interface IDataResponse<T> extends IBasicResponse {
  data?: T;
}

// Feature types
interface ITodo {
  todo_id: number;
  title: string;
  status: TTodoStatus;
  priority: number;
  due_date?: Date;
}
```

### Validation with Zod

Both frontend and backend use Zod for validation:

```typescript
const todoSchema = z.object({
  title: z.string().min(3).max(100),
  status: z.enum(['pending', 'in-progress', 'completed', 'cancelled']),
  priority: z.number().min(1).max(4),
});
```

### Response Format

Standardized API response format:

```typescript
// Success response
{
  "success": true,
  "message": "Todo created successfully",
  "data": { ... }
}

// Error response
{
  "success": false,
  "message": "Validation failed: Title is required"
}
```

---

## Best Practices Summary

### Backend
1. Keep modules self-contained
2. Use dependency injection
3. Validate all inputs in the service layer
4. Handle errors gracefully with try-catch
5. Only expose Service for cross-module use

### Frontend
1. Use Server Actions for data fetching
2. Invalidate cache with `revalidatePath()`
3. Use Suspense for loading states
4. Keep forms in Sheet components
5. Use TanStack Form with Zod validation

---

*Built with ❤️ by the RetailZoom Web Development Team*
