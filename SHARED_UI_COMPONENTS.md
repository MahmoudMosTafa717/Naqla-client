# RecruitAI — Shared UI Components

> Built by **Abdulrahman Nagah** | Sprint 1  
> All components live in `src/components/ui/`  
> Import directly from the file — no index barrel

---

## Table of Contents

- [Button](#button)
- [Badge](#badge)
- [Input & Textarea](#input--textarea)
- [Card](#card)
- [AIScoreBadge & AIScoreCircular](#aiscoreBadge--aiscorecircular)
- [Table](#table)
- [Modal](#modal)
- [Skeleton](#skeleton)

---

## Button

📁 `src/components/ui/Button.jsx`

### Props

| Prop        | Type     | Default   | Options                                               |
| ----------- | -------- | --------- | ----------------------------------------------------- |
| `variant`   | string   | `primary` | `primary` `secondary` `outline` `ghost` `destructive` |
| `size`      | string   | `md`      | `sm` `md` `lg`                                        |
| `disabled`  | boolean  | `false`   | —                                                     |
| `onClick`   | function | —         | —                                                     |
| `className` | string   | `''`      | any extra Tailwind classes                            |

### Examples

```jsx
import { Button } from '../components/ui/Button';

// Variants
<Button variant="primary">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="outline">Edit</Button>
<Button variant="ghost">Skip</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button variant="primary" size="sm">Small</Button>
<Button variant="primary" size="md">Medium</Button>
<Button variant="primary" size="lg">Large</Button>

// Disabled
<Button variant="primary" disabled>Submitting...</Button>

// With onClick
<Button variant="primary" onClick={() => handleSubmit()}>
  Submit Application
</Button>

// With icon (use lucide-react)
import { Plus } from 'lucide-react';
<Button variant="primary">
  <Plus className="w-4 h-4" />
  Add Job
</Button>

// Extra classes
<Button variant="outline" className="w-full mt-4">
  Full Width Button
</Button>
```

---

## Badge

📁 `src/components/ui/Badge.jsx`

### Props

| Prop        | Type   | Default   | Options                                               |
| ----------- | ------ | --------- | ----------------------------------------------------- |
| `variant`   | string | `default` | `default` `success` `warning` `error` `info` `purple` |
| `size`      | string | `sm`      | `sm` `md`                                             |
| `className` | string | `''`      | any extra Tailwind classes                            |

### When to use each variant

| Variant   | Use for                       |
| --------- | ----------------------------- |
| `default` | Neutral status, tags          |
| `success` | Hired, Approved, Active       |
| `warning` | In Review, Pending, Interview |
| `error`   | Rejected, Failed, Inactive    |
| `info`    | Applied, New, Scheduled       |
| `purple`  | AI Matched, AI Scored         |

### Examples

```jsx
import { Badge } from '../components/ui/Badge';

// Application statuses
<Badge variant="info">Applied</Badge>
<Badge variant="warning">In Review</Badge>
<Badge variant="success">Hired</Badge>
<Badge variant="error">Rejected</Badge>

// Job statuses
<Badge variant="success">Active</Badge>
<Badge variant="default">Draft</Badge>
<Badge variant="error">Closed</Badge>

// AI related
<Badge variant="purple">AI Matched</Badge>

// Sizes
<Badge variant="success" size="sm">Small</Badge>
<Badge variant="success" size="md">Medium</Badge>

// Inside a table cell
<TableCell>
  <Badge variant="warning">In Review</Badge>
</TableCell>
```

---

## Input & Textarea

📁 `src/components/ui/Input.jsx`

### Input Props

| Prop        | Type      | Default | Description                                                              |
| ----------- | --------- | ------- | ------------------------------------------------------------------------ |
| `label`     | string    | —       | Label shown above input                                                  |
| `error`     | string    | —       | Red error message shown below                                            |
| `icon`      | ReactNode | —       | Icon shown inside left side                                              |
| `className` | string    | `''`    | extra Tailwind classes                                                   |
| `...props`  | —         | —       | all standard HTML input props (placeholder, type, value, onChange, etc.) |

### Textarea Props

| Prop        | Type   | Default | Description                      |
| ----------- | ------ | ------- | -------------------------------- |
| `label`     | string | —       | Label shown above textarea       |
| `error`     | string | —       | Red error message shown below    |
| `className` | string | `''`    | extra Tailwind classes           |
| `...props`  | —      | —       | all standard HTML textarea props |

### Examples

```jsx
import { Input, Textarea } from '../components/ui/Input';

// Basic input
<Input
  label="Full Name"
  placeholder="Enter your name"
/>

// Email input
<Input
  label="Email"
  type="email"
  placeholder="john@example.com"
/>

// With error (from form validation)
<Input
  label="Email"
  placeholder="Enter email"
  error="Email is required"
/>

// With icon
import { Search } from 'lucide-react';
<Input
  placeholder="Search candidates..."
  icon={<Search className="w-4 h-4" />}
/>

// Controlled input (with React state)
const [email, setEmail] = useState('');
<Input
  label="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Enter email"
/>

// With React Hook Form
<Input
  label="Job Title"
  placeholder="e.g. Senior Developer"
  {...register('jobTitle')}
  error={errors.jobTitle?.message}
/>

// Textarea
<Textarea
  label="Job Description"
  placeholder="Describe the role..."
  rows={5}
/>

// Textarea with error
<Textarea
  label="Cover Letter"
  placeholder="Write your cover letter..."
  rows={6}
  error="Cover letter is required"
/>
```

---

## Card

📁 `src/components/ui/Card.jsx`

### Props

| Prop        | Type     | Default | Description                                 |
| ----------- | -------- | ------- | ------------------------------------------- |
| `hover`     | boolean  | `false` | Adds hover shadow + border highlight effect |
| `onClick`   | function | —       | Makes card clickable                        |
| `className` | string   | `''`    | extra Tailwind classes                      |

### Sub-components

- `<CardHeader>` — top section with border bottom, padding included
- `<CardContent>` — main body section, padding included

### Examples

```jsx
import { Card, CardHeader, CardContent } from '../components/ui/Card';

// Basic card
<Card>
  <CardHeader>
    <h3 className="font-semibold text-lg">Total Applications</h3>
  </CardHeader>
  <CardContent>
    <p className="text-3xl font-bold text-(--color-brand-blue)">248</p>
  </CardContent>
</Card>

// Hoverable card (good for job listings, candidate cards)
<Card hover>
  <CardContent>
    <h3 className="font-semibold">Senior React Developer</h3>
    <p className="text-gray-500 text-sm">Cairo, Egypt · Full Time</p>
  </CardContent>
</Card>

// Clickable card
<Card hover onClick={() => navigate(`/jobs/${job.id}`)}>
  <CardContent>
    <h3 className="font-semibold">{job.title}</h3>
  </CardContent>
</Card>

// Stat card
<Card className="text-center">
  <CardContent>
    <p className="text-4xl font-bold text-(--color-brand-teal)">94%</p>
    <p className="text-gray-500 text-sm mt-1">AI Accuracy</p>
  </CardContent>
</Card>

// Stats row
<div className="grid grid-cols-3 gap-4">
  <Card>
    <CardContent>
      <p className="text-sm text-gray-500">Total Jobs</p>
      <p className="text-2xl font-bold">42</p>
    </CardContent>
  </Card>
  <Card>
    <CardContent>
      <p className="text-sm text-gray-500">Applicants</p>
      <p className="text-2xl font-bold">318</p>
    </CardContent>
  </Card>
  <Card>
    <CardContent>
      <p className="text-sm text-gray-500">Hired</p>
      <p className="text-2xl font-bold">12</p>
    </CardContent>
  </Card>
</div>
```

---

## AIScoreBadge & AIScoreCircular

📁 `src/components/ui/AIScoreBadge.jsx`

> Use these components anywhere you display AI matching scores.

### AIScoreBadge Props

| Prop        | Type    | Default | Description            |
| ----------- | ------- | ------- | ---------------------- |
| `score`     | number  | —       | Score from 0 to 100    |
| `size`      | string  | `md`    | `sm` `md` `lg`         |
| `showIcon`  | boolean | `true`  | Shows the sparkle icon |
| `showLabel` | boolean | `false` | Shows "AI Match" text  |

### AIScoreCircular Props

| Prop          | Type   | Default | Description             |
| ------------- | ------ | ------- | ----------------------- |
| `score`       | number | —       | Score from 0 to 100     |
| `size`        | number | `120`   | Size in px              |
| `strokeWidth` | number | `8`     | Thickness of the circle |

### Score color logic (automatic)

| Score    | Color     |
| -------- | --------- |
| 80 – 100 | Green ✅  |
| 60 – 79  | Teal 🔵   |
| 40 – 59  | Orange ⚠️ |
| 0 – 39   | Gray ⬜   |

### Examples

```jsx
import { AIScoreBadge, AIScoreCircular } from '../components/ui/AIScoreBadge';

// Basic badge in a candidate card
<AIScoreBadge score={88} />

// Small — use inside table cells
<AIScoreBadge score={74} size="sm" />

// Large — use in candidate profile header
<AIScoreBadge score={92} size="lg" showLabel />

// Without icon
<AIScoreBadge score={55} showIcon={false} />

// Circular — use in candidate profile or dashboard
<AIScoreCircular score={92} />

// Smaller circular
<AIScoreCircular score={74} size={80} strokeWidth={6} />

// Inside a candidate card
<Card hover>
  <CardContent className="flex items-center justify-between">
    <div>
      <h3 className="font-semibold">Sara Ahmed</h3>
      <p className="text-gray-500 text-sm">Senior Developer</p>
    </div>
    <AIScoreBadge score={91} showLabel />
  </CardContent>
</Card>

// Conditional rendering
{candidate.aiScore && <AIScoreBadge score={candidate.aiScore} />}
```

---

## Table

📁 `src/components/ui/Table.jsx`

### Sub-components

| Component     | Description                          |
| ------------- | ------------------------------------ |
| `Table`       | Outer wrapper with horizontal scroll |
| `TableHeader` | thead wrapper                        |
| `TableBody`   | tbody wrapper                        |
| `TableFooter` | tfoot wrapper                        |
| `TableRow`    | tr with hover effect                 |
| `TableHead`   | th header cell                       |
| `TableCell`   | td data cell                         |

### Examples

```jsx
import {
  Table, TableHeader, TableBody,
  TableRow, TableHead, TableCell
} from '../components/ui/Table';

// Basic table — always wrap in Card
<Card>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Role</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>AI Score</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {candidates.map(candidate => (
        <TableRow key={candidate.id}>
          <TableCell>{candidate.name}</TableCell>
          <TableCell>{candidate.role}</TableCell>
          <TableCell>
            <Badge variant="success">{candidate.status}</Badge>
          </TableCell>
          <TableCell>
            <AIScoreBadge score={candidate.aiScore} size="sm" />
          </TableCell>
          <TableCell>
            <Button variant="ghost" size="sm">View</Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</Card>

// Empty state
<Card>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Status</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.length === 0 ? (
        <TableRow>
          <TableCell colSpan={2} className="text-center text-gray-400 py-10">
            No records found
          </TableCell>
        </TableRow>
      ) : (
        data.map(item => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>
              <Badge variant="info">{item.status}</Badge>
            </TableCell>
          </TableRow>
        ))
      )}
    </TableBody>
  </Table>
</Card>
```

---

## Modal

📁 `src/components/ui/Modal.jsx`

### Sub-components

| Component          | Description                              |
| ------------------ | ---------------------------------------- |
| `Modal`            | Root wrapper — controls open/close state |
| `ModalTrigger`     | The element that opens the modal         |
| `ModalContent`     | The modal box itself                     |
| `ModalHeader`      | Top section of modal                     |
| `ModalTitle`       | Bold title text                          |
| `ModalDescription` | Subtitle/description text                |
| `ModalFooter`      | Bottom section — put buttons here        |
| `ModalClose`       | Closes the modal when clicked            |

### Examples

```jsx
import {
  Modal, ModalTrigger, ModalContent,
  ModalHeader, ModalTitle, ModalDescription,
  ModalFooter, ModalClose
} from '../components/ui/Modal';

// Basic confirm modal
<Modal>
  <ModalTrigger asChild>
    <Button variant="primary">Move to Next Stage</Button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Confirm Stage Change</ModalTitle>
      <ModalDescription>
        Are you sure you want to move Sara Ahmed to the Interview stage?
      </ModalDescription>
    </ModalHeader>
    <ModalFooter>
      <ModalClose asChild>
        <Button variant="outline">Cancel</Button>
      </ModalClose>
      <Button variant="primary" onClick={() => handleStageChange()}>
        Confirm
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>

// Delete confirm modal
<Modal>
  <ModalTrigger asChild>
    <Button variant="destructive" size="sm">Delete Job</Button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Delete Job Posting</ModalTitle>
      <ModalDescription>
        This action cannot be undone. The job and all applications will be permanently deleted.
      </ModalDescription>
    </ModalHeader>
    <ModalFooter>
      <ModalClose asChild>
        <Button variant="outline">Cancel</Button>
      </ModalClose>
      <Button variant="destructive" onClick={() => handleDelete(job.id)}>
        Yes, Delete
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>

// Form inside modal
<Modal>
  <ModalTrigger asChild>
    <Button variant="primary">Add Note</Button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Add Note</ModalTitle>
    </ModalHeader>
    <div className="space-y-4">
      <Input label="Title" placeholder="Note title" />
      <Textarea label="Note" placeholder="Write your note..." rows={4} />
    </div>
    <ModalFooter>
      <ModalClose asChild>
        <Button variant="outline">Cancel</Button>
      </ModalClose>
      <Button variant="primary" onClick={() => handleAddNote()}>
        Save Note
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>

// Controlled modal (open/close with state)
const [open, setOpen] = useState(false);
<Modal open={open} onOpenChange={setOpen}>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Controlled Modal</ModalTitle>
    </ModalHeader>
    <ModalFooter>
      <Button variant="primary" onClick={() => setOpen(false)}>Close</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

---

## Skeleton

📁 `src/components/ui/Skeleton.jsx`

> Use Skeleton while data is loading. Replace real content with Skeleton, then swap back when data arrives.

### Props

| Prop        | Type   | Default | Description                                |
| ----------- | ------ | ------- | ------------------------------------------ |
| `className` | string | `''`    | Control width, height, shape with Tailwind |

### Examples

```jsx
import { Skeleton } from '../components/ui/Skeleton';

// Text lines loading
<div className="space-y-3">
  <Skeleton className="h-5 w-3/4" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-5/6" />
</div>

// Card loading state
<Card>
  <CardContent className="space-y-3">
    <Skeleton className="h-6 w-1/2" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-9 w-28 rounded-lg" />
  </CardContent>
</Card>

// Avatar loading
<Skeleton className="w-10 h-10 rounded-full" />

// Table rows loading
{isLoading ? (
  Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i}>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
    </TableRow>
  ))
) : (
  data.map(item => ( ... ))
)}

// With React Query isLoading
const { data, isLoading } = useQuery({ queryKey: ['jobs'], queryFn: fetchJobs });

if (isLoading) return (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <Card key={i}>
        <CardContent className="space-y-2">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    ))}
  </div>
);
```

---

## CSS Variables Reference

These brand colors are available across all components:

```css
--color-brand-blue        /* #1E3A8A  — primary dark blue */
--color-brand-teal        /* #14B8A6  — secondary teal */
--color-brand-blue-light  /* #3b82f6  — hover state blue */
--color-brand-teal-light  /* #5eead4  — hover state teal */
--color-success           /* #10b981  — green */
--color-warning           /* #f59e0b  — orange */
--color-destructive       /* #dc2626  — red */
--color-border            /* #e2e8f0  — borders */
--color-muted-foreground  /* #64748b  — gray text */
```

Use them in your own components like this:

```jsx
<div className="text-(--color-brand-blue)">Blue text</div>
<div className="bg-(--color-brand-teal)">Teal background</div>
<div className="border-(--color-border)">Bordered div</div>
```
